import { networks } from '..';
import * as bscript from '../script';
import { stacksEqual, typeforce as typef } from '../types';
import { Payment, PaymentOpts, Stack } from './index';
import * as lazy from './lazy';

const OPS = bscript.OPS;

// output: OP_RETURN ...
/**
 * Embeds data in a Bitcoin payment.
 * @param a - The payment object.
 * @param opts - Optional payment options.
 * @returns The modified payment object.
 * @throws {TypeError} If there is not enough data or if the output is invalid.
 */
export function p2data(a: Payment, opts?: PaymentOpts): Payment {
  if (!a.data && !a.output) throw new TypeError('Not enough data');
  opts = Object.assign({ validate: true }, opts || {});

  typef(
    {
      output: typef.maybe(typef.Buffer),
      data: typef.maybe(typef.arrayOf(typef.Buffer)),
    },
    a,
  );

  const network = networks.junkcoin;
  const o = { name: 'embed', network } as Payment;

  lazy.prop(o, 'output', () => {
    if (!a.data) return;
    return bscript.compile(([OPS.OP_RETURN] as Stack).concat(a.data));
  });
  lazy.prop(o, 'data', () => {
    if (!a.output) return;
    return bscript.decompile(a.output)!.slice(1);
  });

  // extended validation
  if (opts.validate) {
    if (a.output) {
      const chunks = bscript.decompile(a.output);
      if (chunks![0] !== OPS.OP_RETURN)
        throw new TypeError('Output is invalid');
      if (!chunks!.slice(1).every(typef.Buffer))
        throw new TypeError('Output is invalid');

      if (a.data && !stacksEqual(a.data, o.data as Buffer[]))
        throw new TypeError('Data mismatch');
    }
  }

  return Object.assign(o, a);
}
