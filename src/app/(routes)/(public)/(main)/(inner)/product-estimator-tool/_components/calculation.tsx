import { inferRouterOutputs } from '@trpc/server';
import { AnimatePresence, motion as m } from 'framer-motion';
import { InfoIcon, XIcon } from 'lucide-react';
import Image from 'next/image';
import Link from 'next/link';

import { Card, CardContent, CardFooter, CardHeader } from '@/components/ui/card';
import { Checkbox } from '@/components/ui/checkbox';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { Popover, PopoverContent, PopoverTrigger } from '@/components/ui/popover';
import {
    Table, TableBody, TableCell, TableFooter, TableHead, TableHeader, TableRow
} from '@/components/ui/table';
import { productRoute } from '@/data/routes';
import { scaleOpacityVariants } from '@/lib/motion-variants';
import { formatAmount, loadPublicFile } from '@/lib/utils';
import { AppRouter } from '@/server/routers';

import { useCalculation } from '../_hooks/use-calculation';

interface CalculationProps {
  products: inferRouterOutputs<AppRouter>["product"]["get"];
}

export default function Calculation({ products }: CalculationProps) {
  const { items, removeItem, onFieldChange, toggleStack } = useCalculation();

  return (
    <AnimatePresence>
      <m.div layout className="grid gap-8 lg:grid-cols-2">
        {items.map((item, index) => (
          <m.div
            key={`item-${item.id}`}
            layout
            variants={scaleOpacityVariants}
            initial="initial"
            animate="animate"
            exit="exit"
            transition={{ duration: 0.2 }}
            custom={index}
          >
            <Card className="space-y-2 p-6">
              <CardHeader className="flex-row items-center justify-between space-y-0 p-0">
                <h4 className="font-bold">{item.areaName}</h4>
                <XIcon
                  onClick={() => removeItem(item.id)}
                  className="transition hover:scale-125 hover:cursor-pointer hover:text-red-500"
                />
              </CardHeader>
              <CardContent className="space-y-4 p-0">
                <div className="grid gap-2 p-0 md:grid-cols-2">
                  <div>
                    <Label>Width (inches)</Label>
                    <Input
                      type="number"
                      name="width"
                      value={item.width}
                      onChange={(e) =>
                        onFieldChange({
                          products,
                          itemId: item.id,
                          field: {
                            name: e.target.name,
                            value: e.target.value,
                          },
                        })
                      }
                      placeholder="Enter width"
                      className="py-3"
                    />
                  </div>
                  <div>
                    <Label>Height (inches)</Label>
                    <Input
                      type="number"
                      name="height"
                      value={item.height}
                      onChange={(e) =>
                        onFieldChange({
                          products,
                          itemId: item.id,
                          field: {
                            name: e.target.name,
                            value: e.target.value,
                          },
                        })
                      }
                      placeholder="Enter height"
                      className="py-3"
                    />
                  </div>
                </div>

                {!!item.items.length && (
                  <>
                    {item.canStack && (
                      <div className="flex items-center justify-end space-x-2">
                        <Checkbox
                          id={item.id}
                          checked={item.isStack}
                          onCheckedChange={() =>
                            toggleStack({ products, itemId: item.id })
                          }
                        />
                        <label
                          htmlFor={item.id}
                          className="text-sm font-medium leading-none hover:cursor-pointer peer-disabled:cursor-not-allowed peer-disabled:opacity-70"
                        >
                          Stack
                        </label>

                        <Popover>
                          <PopoverTrigger asChild>
                            <InfoIcon className="size-5 text-orange-400 hover:cursor-pointer" />
                          </PopoverTrigger>
                          <PopoverContent className="w-80 rounded-lg sm:w-[500px]">
                            <div className="grid gap-4 sm:grid-cols-2">
                              <div className="space-y-2">
                                <Image
                                  src="/images/is-4.webp"
                                  alt="BEAVER DAM"
                                  width={1280}
                                  height={729}
                                  className="rounded-lg object-contain transition"
                                />
                                <h3 className="font-bold text-primary">
                                  Without Stack
                                </h3>
                              </div>
                              <div className="space-y-2">
                                <Image
                                  src="/images/is-5.webp"
                                  alt="BEAVER DAM"
                                  width={1280}
                                  height={729}
                                  className="rounded-lg object-contain transition"
                                />
                                <h3 className="font-bold text-primary">
                                  With Stack
                                </h3>
                              </div>
                            </div>
                          </PopoverContent>
                        </Popover>
                      </div>
                    )}

                    <Table>
                      <TableHeader>
                        <TableRow>
                          <TableHead>Product</TableHead>
                          <TableHead className="text-center">
                            Quantity
                          </TableHead>
                          <TableHead className="text-right">Amount</TableHead>
                        </TableRow>
                      </TableHeader>
                      <TableBody>
                        {item.items.map((row) => (
                          <TableRow key={row.id}>
                            <TableCell>
                              <div className="flex gap-2">
                                <Image
                                  src={loadPublicFile(row.image)}
                                  alt={process.env.NEXT_PUBLIC_APP_NAME}
                                  width={200}
                                  height={200}
                                  className="hidden aspect-square w-20 rounded-xl object-cover sm:block"
                                />
                                <div className="grid justify-between py-1">
                                  <div>
                                    <Link
                                      href={productRoute(row.id)}
                                      target="_blank"
                                    >
                                      <h3
                                        title={row.name}
                                        className="line-clamp-1 text-sm font-bold hover:text-primary"
                                      >
                                        {row.name}
                                      </h3>
                                    </Link>
                                    <p
                                      title={row.shortDescription ?? ""}
                                      className="line-clamp-1 text-sm opacity-60"
                                    >
                                      {row.shortDescription}
                                    </p>
                                  </div>
                                  <p className="text-sm font-bold opacity-80">
                                    {formatAmount(row.price)}
                                  </p>
                                </div>
                              </div>
                            </TableCell>
                            <TableCell className="text-center">
                              {row.quantity}
                            </TableCell>
                            <TableCell className="text-right">
                              {formatAmount(row.amount)}
                            </TableCell>
                          </TableRow>
                        ))}
                      </TableBody>
                      <TableFooter>
                        <TableRow>
                          <TableCell colSpan={2}>Total</TableCell>
                          <TableCell className="text-right font-bold">
                            {formatAmount(item.amount)}
                          </TableCell>
                        </TableRow>
                      </TableFooter>
                    </Table>
                  </>
                )}
              </CardContent>
              <CardFooter className="space-2 mt-1 flex-col items-start p-0">
                {!!item.widthError && (
                  <p className="text-sm text-red-500">{item.widthError}</p>
                )}
                {!!item.heightError && (
                  <p className="text-sm text-red-500">{item.heightError}</p>
                )}

                {!item.widthError &&
                  !item.heightError &&
                  !item.items.length && (
                    <p className="mx-auto mt-4 text-sm ">No Product Found!</p>
                  )}
              </CardFooter>
            </Card>
          </m.div>
        ))}
      </m.div>
    </AnimatePresence>
  );
}
