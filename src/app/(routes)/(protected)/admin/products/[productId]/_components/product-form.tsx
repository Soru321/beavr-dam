"use client";

import { zodResolver } from "@hookform/resolvers/zod";
import { inferRouterOutputs } from "@trpc/server";
import { PackagePlusIcon } from "lucide-react";
import dynamic from "next/dynamic";
import { useRouter } from "next/navigation";
import { useForm } from "react-hook-form";
import toast from "react-hot-toast";
import { BeatLoader } from "react-spinners";

import { trpcClient } from "@/app/_trpc/client";
import { Button } from "@/components/ui/button";
import {
  Form,
  FormControl,
  FormField,
  FormItem,
  FormLabel,
  FormMessage,
} from "@/components/ui/form";
import { Input } from "@/components/ui/input";
import FileInput from "@/components/ui/other/file-input";
import {
  Select,
  SelectContent,
  SelectGroup,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";
import { Switch } from "@/components/ui/switch";
import { Textarea } from "@/components/ui/textarea";
import { ProductUpdate, productUpdateSchema } from "@/lib/zod/admin/product";
import { productType } from "@/lib/zod/product";
import { AppRouter } from "@/server/routers";

const JoditEditor = dynamic(() => import("jodit-react"), { ssr: false });

interface ProductFormProps {
  product: inferRouterOutputs<AppRouter>["admin"]["product"]["getById"];
}

export default function ProductForm({ product }: ProductFormProps) {
  const router = useRouter();
  const form = useForm<ProductUpdate>({
    resolver: zodResolver(productUpdateSchema),
    defaultValues: {
      id: product?.id,
      type: product?.type ?? "GATE",
      name: product?.name ?? "",
      price: !!product?.price ? +product?.price : 0,
      width: product?.width ?? 0,
      minWidth: product?.minWidth ?? 0,
      maxWidth: product?.maxWidth ?? 0,
      height: product?.height ?? 0,
      minHeight: product?.minHeight ?? 0,
      maxHeight: product?.maxHeight ?? 0,
      sku: product?.sku ?? "",
      isFeatured: product?.isFeatured ?? false,
      shortDescription: product?.shortDescription ?? "",
      description: product?.description ?? "",
      images: [],
      deletedImages: [],
    },
  });
  const type = form.watch("type");
  const updateProduct = trpcClient.admin.product.update.useMutation();

  const onSubmit = (formValues: ProductUpdate) => {
    if (
      !formValues.images.length &&
      formValues.deletedImages.length > (product?.productFiles.length ?? 0)
    ) {
      form.setError("images", { message: "The field is required" });
    }

    updateProduct.mutate(formValues, {
      onSuccess: ({ message }) => {
        toast.success(message);
        router.back();
      },
      onError: (error) => {
        toast.error(error.message);
      },
    });
  };

  const onSetDeletedImagesValue = (ids: number[]) => {
    form.setValue("deletedImages", ids);
  };

  return (
    <Form {...form}>
      <form onSubmit={form.handleSubmit(onSubmit)}>
        <div className="flex flex-col-reverse gap-8 lg:flex-row">
          <div className="space-y-4 lg:w-3/5">
            <div className="grid gap-4 md:grid-cols-2">
              <FormField
                control={form.control}
                name="type"
                render={({ field }) => (
                  <FormItem>
                    <FormLabel>PRODUCT TYPE</FormLabel>
                    <FormControl>
                      <Select
                        value={field.value}
                        onValueChange={field.onChange}
                      >
                        <SelectTrigger className="bg-gray-100 py-6">
                          <SelectValue placeholder="Select product type" />
                        </SelectTrigger>
                        <SelectContent>
                          <SelectGroup>
                            {productType._def.values.map((type) => (
                              <SelectItem
                                key={`product-type-${type}`}
                                value={type}
                              >
                                {type}
                              </SelectItem>
                            ))}
                          </SelectGroup>
                        </SelectContent>
                      </Select>
                    </FormControl>
                    <FormMessage />
                  </FormItem>
                )}
              />

              <FormField
                control={form.control}
                name="name"
                render={({ field }) => (
                  <FormItem>
                    <FormLabel>PRODUCT NAME</FormLabel>
                    <FormControl>
                      <Input
                        {...field}
                        placeholder="Enter product name"
                        className="bg-gray-100 py-6"
                      />
                    </FormControl>
                    <FormMessage />
                  </FormItem>
                )}
              />
            </div>

            <FormField
              control={form.control}
              name="price"
              render={({ field }) => (
                <FormItem>
                  <FormLabel>Price</FormLabel>
                  <FormControl>
                    <Input
                      {...field}
                      type="number"
                      placeholder="Enter price"
                      className="bg-gray-100 py-6"
                    />
                  </FormControl>
                  <FormMessage />
                </FormItem>
              )}
            />

            {type !== "OTHER" && (
              <div className="grid gap-4 md:grid-cols-3">
                {type === "POLE" && (
                  <FormField
                    control={form.control}
                    name="width"
                    render={({ field }) => (
                      <FormItem>
                        <FormLabel>WIDTH</FormLabel>
                        <FormControl>
                          <Input
                            {...field}
                            type="number"
                            placeholder="Enter width"
                            className="bg-gray-100 py-6"
                          />
                        </FormControl>
                        <FormMessage />
                      </FormItem>
                    )}
                  />
                )}

                {type === "GATE" && (
                  <>
                    <FormField
                      control={form.control}
                      name="minWidth"
                      render={({ field }) => (
                        <FormItem>
                          <FormLabel>MINIMUM WIDTH</FormLabel>
                          <FormControl>
                            <Input
                              {...field}
                              type="number"
                              placeholder="Enter minimum width"
                              className="bg-gray-100 py-6"
                            />
                          </FormControl>
                          <FormMessage />
                        </FormItem>
                      )}
                    />

                    <FormField
                      control={form.control}
                      name="maxWidth"
                      render={({ field }) => (
                        <FormItem>
                          <FormLabel>MAXIMUM WIDTH</FormLabel>
                          <FormControl>
                            <Input
                              {...field}
                              type="number"
                              placeholder="Enter maximum width"
                              className="bg-gray-100 py-6"
                            />
                          </FormControl>
                          <FormMessage />
                        </FormItem>
                      )}
                    />

                    <FormField
                      control={form.control}
                      name="height"
                      render={({ field }) => (
                        <FormItem>
                          <FormLabel>HEIGHT</FormLabel>
                          <FormControl>
                            <Input
                              {...field}
                              type="number"
                              placeholder="Enter height"
                              className="bg-gray-100 py-6"
                            />
                          </FormControl>
                          <FormMessage />
                        </FormItem>
                      )}
                    />
                  </>
                )}

                {type === "POLE" && (
                  <>
                    <FormField
                      control={form.control}
                      name="minHeight"
                      render={({ field }) => (
                        <FormItem>
                          <FormLabel>MINIMUM HEIGHT</FormLabel>
                          <FormControl>
                            <Input
                              {...field}
                              type="number"
                              placeholder="Enter minimum height"
                              className="bg-gray-100 py-6"
                            />
                          </FormControl>
                          <FormMessage />
                        </FormItem>
                      )}
                    />

                    <FormField
                      control={form.control}
                      name="maxHeight"
                      render={({ field }) => (
                        <FormItem>
                          <FormLabel>MAXIMUM HEIGHT</FormLabel>
                          <FormControl>
                            <Input
                              {...field}
                              type="number"
                              placeholder="Enter maximum height"
                              className="bg-gray-100 py-6"
                            />
                          </FormControl>
                          <FormMessage />
                        </FormItem>
                      )}
                    />
                  </>
                )}
              </div>
            )}

            <FormField
              control={form.control}
              name="sku"
              render={({ field }) => (
                <FormItem>
                  <FormLabel>PRODUCT SKU</FormLabel>
                  <FormControl>
                    <Input
                      {...field}
                      placeholder="Enter product sku"
                      className="bg-gray-100 py-6"
                    />
                  </FormControl>
                  <FormMessage />
                </FormItem>
              )}
            />

            <FormField
              control={form.control}
              name="shortDescription"
              render={({ field }) => (
                <FormItem>
                  <FormLabel>PRODUCT SHORT DESCRIPTION</FormLabel>
                  <FormControl>
                    <Textarea
                      {...field}
                      rows={5}
                      placeholder="Enter product short description"
                      className="bg-gray-100"
                    />
                  </FormControl>
                  <FormMessage />
                </FormItem>
              )}
            />

            <FormField
              control={form.control}
              name="description"
              render={({ field }) => (
                <FormItem>
                  <FormLabel>PRODUCT DESCRIPTION</FormLabel>
                  <FormControl>
                    <JoditEditor
                      value={field.value}
                      onBlur={(newContent) => field.onChange(newContent)}
                      config={{ height: 500 }}
                    />
                  </FormControl>
                  <FormMessage />
                </FormItem>
              )}
            />

            <FormField
              control={form.control}
              name="isFeatured"
              render={({ field }) => (
                <FormItem>
                  <FormLabel>IS FEATURED</FormLabel>
                  <FormControl className="block">
                    <Switch
                      checked={field.value}
                      onCheckedChange={field.onChange}
                    />
                  </FormControl>
                  <FormMessage />
                </FormItem>
              )}
            />

            <Button
              type="submit"
              size="lg"
              disabled={updateProduct.isPending}
              className="space-x-2"
            >
              {updateProduct.isPending ? (
                <BeatLoader color="#fff" />
              ) : (
                <>
                  <PackagePlusIcon />
                  <span>Update</span>
                </>
              )}
            </Button>
          </div>

          <div className="max-w-96 lg:w-2/5">
            <FormField
              control={form.control}
              name="images"
              render={({ field }) => (
                <FormItem>
                  <FormLabel className="font-semibold">
                    PRODUCT IMAGES
                  </FormLabel>
                  <FormControl>
                    <FileInput
                      product={product}
                      onFilesChange={field.onChange}
                      onFileDelete={onSetDeletedImagesValue}
                      limit={20}
                      className="w-full"
                    />
                  </FormControl>
                  <FormMessage />
                </FormItem>
              )}
            />
          </div>
        </div>
      </form>
    </Form>
  );
}
