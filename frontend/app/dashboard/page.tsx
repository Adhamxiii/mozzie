"use client";
import React, { useCallback, useEffect, useRef, useState } from "react";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import {
  Table,
  TableBody,
  TableCell,
  TableHead,
  TableHeader,
  TableRow,
} from "@/components/ui/table";
import { Label } from "@/components/ui/label";
import { Pencil, Trash2, Plus } from "lucide-react";
import { useAppHook } from "@/context/AppProvider";
import { useRouter } from "next/navigation";
import Image from "next/image";
import axios from "axios";
import toast from "react-hot-toast";

interface Product {
  id: number;
  title: string;
  description: string;
  cost: number;
  file: string;
  banner_image: File | null;
}

const DashboardPage: React.FC = () => {
  const { authToken } = useAppHook();
  const [products, setProducts] = useState<Product[]>([]);
  const router = useRouter();
  const [isEditing, setIsEditing] = useState(false);
  const fileRef = useRef<HTMLInputElement>(null);
  const [formData, setFormData] = useState<Product>({
    id: 0,
    title: "",
    description: "",
    cost: 0,
    file: "",
    banner_image: null,
  });

  const fetchAllProducts = useCallback(async () => {
    const response = await axios.get(
      `${process.env.NEXT_PUBLIC_API_URL}/products`,
      {
        headers: {
          Authorization: `Bearer ${authToken}`,
        },
      }
    );
    setProducts(response.data.products);
  }, [authToken]);

  useEffect(() => {
    if (!authToken) {
      router.push("/auth");
      return;
    }
    fetchAllProducts();
  }, [authToken, fetchAllProducts, router]);

  const handleFormSubmit = async (e: React.FormEvent<HTMLFormElement>) => {
    e.preventDefault();

    try {
      if (isEditing) {
        await updateProduct();
      } else {
        await addProduct();
      }
      fetchAllProducts();
      setFormData({
        id: 0,
        title: "",
        description: "",
        cost: 0,
        file: "",
        banner_image: null,
      });
    } catch (error) {
      console.error(error);
      toast.error("Failed to add product");
    }
  };

  const addProduct = async () => {
    const response = await axios.post(
      `${process.env.NEXT_PUBLIC_API_URL}/products`,
      formData,
      { headers: { Authorization: `Bearer ${authToken}` } }
    );
    if (response.data.status) {
      toast.success(response.data.message);
    }
  };

  const updateProduct = async () => {
    const response = await axios.put(
      `${process.env.NEXT_PUBLIC_API_URL}/products/${formData.id}`,
      formData,
      { headers: { Authorization: `Bearer ${authToken}` } }
    );
    if (response.data.status) {
      toast.success(response.data.message);
    }
  };

  const handleEditProduct = (id: number) => {
    const product = products.find((product) => product.id === id);
    if (product) {
      setFormData(product);
      setIsEditing(true);
    }
  };

  const handleDeleteProduct = async (id: number) => {
    const response = await axios.delete(
      `${process.env.NEXT_PUBLIC_API_URL}/products/${id}`,
      {
        headers: {
          Authorization: `Bearer ${authToken}`,
        },
      }
    );
    if (response.data.status) {
      toast.success(response.data.message);
      fetchAllProducts();
    }
  };
  
  return (
    <div className="container mx-auto py-8 px-4">
      <div className="grid grid-cols-1 lg:grid-cols-2 gap-8">
        <Card className="shadow-lg">
          <CardHeader>
            <CardTitle className="flex items-center gap-2">
              <Plus className="h-5 w-5" />
              {isEditing ? "Edit Product" : "Add New Product"}
            </CardTitle>
          </CardHeader>
          <CardContent>
            <form className="space-y-4" onSubmit={handleFormSubmit}>
              <div className="space-y-2">
                <Label htmlFor="title">Product Title</Label>
                <Input
                  id="title"
                  name="title"
                  placeholder="Enter product title"
                  required
                  value={formData.title}
                  onChange={(e) =>
                    setFormData({ ...formData, title: e.target.value })
                  }
                />
              </div>

              <div className="space-y-2">
                <Label htmlFor="description">Description</Label>
                <Input
                  id="description"
                  name="description"
                  placeholder="Enter product description"
                  required
                  value={formData.description}
                  onChange={(e) =>
                    setFormData({ ...formData, description: e.target.value })
                  }
                />
              </div>

              <div className="space-y-2">
                <Label htmlFor="cost">Cost</Label>
                <Input
                  id="cost"
                  name="cost"
                  type="number"
                  placeholder="Enter product cost"
                  required
                  min="0"
                  step="0.01"
                  value={formData.cost}
                  onChange={(e) =>
                    setFormData({
                      ...formData,
                      cost: parseFloat(e.target.value) || 0,
                    })
                  }
                />
              </div>

              <div className="space-y-2">
                <Label htmlFor="banner">Product Image</Label>
                <div className="flex items-center gap-4">
                  {formData.banner_image && (
                    <div className="w-24 h-24 border-2 border-dashed rounded-lg flex items-center justify-center bg-muted/50">
                      <Image
                        width={100}
                        height={100}
                        src={formData.file}
                        alt="Preview"
                        className="w-full h-full object-cover rounded-lg"
                      />
                    </div>
                  )}
                  <Input
                    id="banner"
                    type="file"
                    accept="image/*"
                    className="flex-1"
                    onChange={(e) => {
                      const file = e.target.files?.[0];
                      if (file) {
                        const imageUrl = URL.createObjectURL(file);
                        setFormData({
                          ...formData,
                          file: imageUrl,
                          banner_image: file,
                        });
                      }
                    }}
                    ref={fileRef}
                  />
                </div>
              </div>

              <Button type="submit" className="w-full">
                {isEditing ? "Update Product" : "Add Product"}
              </Button>
            </form>
          </CardContent>
        </Card>

        <Card className="shadow-lg">
          <CardHeader>
            <CardTitle>Product List</CardTitle>
          </CardHeader>
          <CardContent>
            <div className="rounded-md border">
              <Table>
                <TableHeader>
                  <TableRow>
                    <TableHead>ID</TableHead>
                    <TableHead>Title</TableHead>
                    <TableHead>Image</TableHead>
                    <TableHead>Cost</TableHead>
                    <TableHead className="text-right">Actions</TableHead>
                  </TableRow>
                </TableHeader>
                <TableBody>
                  {products.map((product, index) => (
                    <TableRow key={index}>
                      <TableCell>{product.id}</TableCell>
                      <TableCell>{product.title}</TableCell>
                      <TableCell>
                        <div className="w-12 h-12 rounded-md overflow-hidden">
                          <Image
                            src={String(product.banner_image ?? product.file)}
                            alt="Product"
                            width={48}
                            height={48}
                            unoptimized
                            className="w-full h-full object-cover"
                          />
                        </div>
                      </TableCell>
                      <TableCell>${product.cost}</TableCell>
                      <TableCell className="text-right">
                        <div className="flex justify-end gap-2">
                          <Button
                            variant="outline"
                            size="icon"
                            onClick={() => handleEditProduct(product.id)}
                          >
                            <Pencil className="h-4 w-4" />
                          </Button>
                          <Button
                            variant="destructive"
                            size="icon"
                            onClick={() => handleDeleteProduct(product.id)}
                          >
                            <Trash2 className="h-4 w-4" />
                          </Button>
                        </div>
                      </TableCell>
                    </TableRow>
                  ))}
                </TableBody>
              </Table>
            </div>
          </CardContent>
        </Card>
      </div>
    </div>
  );
};

export default DashboardPage;
