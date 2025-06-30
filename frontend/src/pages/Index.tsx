import React, { useState, useEffect, useCallback } from "react";
import {
  Search,
  Plus,
  Eye,
  Edit,
  Package,
  Trash2,
  ArrowUpAZ,
  ArrowDownAZ,
} from "lucide-react";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import {
  AlertDialog,
  AlertDialogAction,
  AlertDialogCancel,
  AlertDialogContent,
  AlertDialogDescription,
  AlertDialogFooter,
  AlertDialogHeader,
  AlertDialogTitle,
  AlertDialogTrigger,
} from "@/components/ui/alert-dialog";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";
import { ToggleGroup, ToggleGroupItem } from "@/components/ui/toggle-group";
import ProductModal from "@/components/ProductModal";
import { useToast } from "@/hooks/use-toast";
import { productService } from "@/services/productService";
import { Product, ProductListParams } from "@/interface";
import { ITEMS_PER_PAGE } from "@/constant";

const Index = () => {
  const [products, setProducts] = useState<Product[]>([]);
  const [searchTerm, setSearchTerm] = useState("");
  const [debouncedSearchTerm, setDebouncedSearchTerm] = useState("");
  const [currentPage, setCurrentPage] = useState(1);
  const [totalProducts, setTotalProducts] = useState(0);
  const [isLoading, setIsLoading] = useState(false);
  const [isModalOpen, setIsModalOpen] = useState(false);
  const [modalMode, setModalMode] = useState<"create" | "edit" | "view">(
    "create"
  );
  const [selectedProduct, setSelectedProduct] = useState<Product | null>(null);
  const [sortBy, setSortBy] = useState<"quantity" | "price" | "">("");
  const [sortOrder, setSortOrder] = useState<"asc" | "desc">("asc");
  const { toast } = useToast();

  // Debounce search term
  useEffect(() => {
    const timer = setTimeout(() => {
      setDebouncedSearchTerm(searchTerm);
      setCurrentPage(1);
    }, 300);

    return () => clearTimeout(timer);
  }, [searchTerm]);

  const fetchProducts = useCallback(async () => {
    setIsLoading(true);
    try {
      const params: ProductListParams = {
        page: currentPage,
        limit: ITEMS_PER_PAGE,
      };

      if (debouncedSearchTerm) {
        params.search = debouncedSearchTerm;
      }

      if (sortBy) {
        params.sortBy = sortBy;
        params.order = sortOrder;
      }

      const response = await productService.getProducts(params);
      console.log(response);
      setProducts(response.data || []);
      setTotalProducts(response.total || 0);
    } catch (error) {
      console.error("Error fetching products:", error);
      toast({
        title: "Error",
        description: "Failed to fetch products. Please try again.",
        variant: "destructive",
      });
      setProducts([]);
      setTotalProducts(0);
    } finally {
      setIsLoading(false);
    }
  }, [currentPage, debouncedSearchTerm, sortBy, sortOrder, toast]);

  // Fetch products when dependencies change
  useEffect(() => {
    fetchProducts();
  }, [fetchProducts]);

  const totalPages = Math.ceil(totalProducts / ITEMS_PER_PAGE);

  const handleCreateProduct = () => {
    setModalMode("create");
    setSelectedProduct(null);
    setIsModalOpen(true);
  };

  const handleViewProduct = async (product: Product) => {
    try {
      const fullProduct = await productService.getProduct(product.id);
      setModalMode("view");
      setSelectedProduct(fullProduct);
      setIsModalOpen(true);
    } catch (error) {
      console.error("Error fetching product details:", error);
      toast({
        title: "Error",
        description: "Failed to fetch product details.",
        variant: "destructive",
      });
    }
  };

  const handleEditProduct = async (product: Product) => {
    try {
      const fullProduct = await productService.getProduct(product.id);
      setModalMode("edit");
      setSelectedProduct(fullProduct);
      setIsModalOpen(true);
    } catch (error) {
      console.error("Error fetching product details:", error);
      toast({
        title: "Error",
        description: "Failed to fetch product details.",
        variant: "destructive",
      });
    }
  };

  const handleDeleteProduct = async (product: Product) => {
    try {
      await productService.deleteProduct(product.id);
      toast({
        title: "Success",
        description: "Product deleted successfully!",
      });
      fetchProducts();
    } catch (error) {
      console.error("Error deleting product:", error);
      toast({
        title: "Error",
        description: "Failed to delete product. Please try again.",
        variant: "destructive",
      });
    }
  };

  const handleSaveProduct = async (productData: Omit<Product, "id">) => {
    try {
      if (modalMode === "create") {
        await productService.createProduct(productData);
        toast({
          title: "Success",
          description: "Product created successfully!",
        });
      } else if (modalMode === "edit" && selectedProduct) {
        await productService.updateProduct(selectedProduct.id, productData);
        toast({
          title: "Success",
          description: "Product updated successfully!",
        });
      }
      setIsModalOpen(false);
      // Refresh the products list
      fetchProducts();
    } catch (error) {
      console.error("Error saving product:", error);
      toast({
        title: "Error",
        description: "Failed to save product. Please try again.",
        variant: "destructive",
      });
    }
  };

  const handlePageChange = (page: number) => {
    setCurrentPage(page);
  };

  const handleSortChange = (value: string) => {
    if (value === sortBy) {
      // If same field is selected, toggle order
      setSortOrder(sortOrder === "asc" ? "desc" : "asc");
    } else {
      setSortBy(value as "quantity" | "price");
      setSortOrder("asc");
    }
    setCurrentPage(1); // Reset to first page when sorting
  };

  const handleSortOrderToggle = (value: string) => {
    console.log(sortOrder, value);
    if (value && value !== sortOrder) {
      console.log("here");
      setSortOrder(value as "asc" | "desc");
    }
  };

  return (
    <div className="min-h-screen bg-gray-50 p-4 sm:p-6 lg:p-8">
      <div className="max-w-7xl mx-auto">
        {/* Header */}
        <div className="mb-8">
          <h1 className="text-3xl font-bold text-gray-900 mb-2">
            Product Management
          </h1>
          <p className="text-gray-600">Manage your product inventory</p>
        </div>

        {/* Search, Sort and Create Button */}
        <div className="flex flex-col lg:flex-row gap-4 mb-6">
          <div className="relative flex-1">
            <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 text-gray-400 w-4 h-4" />
            <Input
              placeholder="Search products by name, category, or description..."
              value={searchTerm}
              onChange={(e) => setSearchTerm(e.target.value)}
              className="pl-10"
            />
          </div>

          {/* Sorting Controls */}
          <div className="flex flex-col sm:flex-row gap-2">
            <Select value={sortBy} onValueChange={handleSortChange}>
              <SelectTrigger className="w-full sm:w-[180px]">
                <SelectValue placeholder="Sort by..." />
              </SelectTrigger>
              <SelectContent>
                <SelectItem value="quantity">Sort by Quantity</SelectItem>
                <SelectItem value="price">Sort by Price</SelectItem>
              </SelectContent>
            </Select>

            {sortBy && (
              <ToggleGroup
                type="single"
                value={sortOrder}
                onValueChange={handleSortOrderToggle}
                className="border rounded-md p-1"
              >
                <ToggleGroupItem value="asc" aria-label="Ascending" size="sm">
                  <ArrowUpAZ className="h-4 w-4" />
                </ToggleGroupItem>
                <ToggleGroupItem value="desc" aria-label="Descending" size="sm">
                  <ArrowDownAZ className="h-4 w-4" />
                </ToggleGroupItem>
              </ToggleGroup>
            )}
          </div>

          <Button
            onClick={handleCreateProduct}
            className="flex items-center gap-2 whitespace-nowrap"
          >
            <Plus className="w-4 h-4" />
            Create Product
          </Button>
        </div>

        {isLoading && (
          <div className="text-center py-12">
            <div className="animate-spin rounded-full h-8 w-8 border-b-2 border-gray-900 mx-auto"></div>
            <p className="mt-4 text-gray-600">Loading products...</p>
          </div>
        )}

        {/* Products Grid */}
        {!isLoading && products.length === 0 ? (
          <div className="text-center py-12">
            <Package className="w-16 h-16 text-gray-400 mx-auto mb-4" />
            <h3 className="text-lg font-medium text-gray-900 mb-2">
              No products found
            </h3>
            <p className="text-gray-600 mb-4">
              {debouncedSearchTerm
                ? "No products match your search criteria."
                : "Get started by creating your first product."}
            </p>
            {!debouncedSearchTerm && (
              <Button
                onClick={handleCreateProduct}
                className="flex items-center gap-2 mx-auto"
              >
                <Plus className="w-4 h-4" />
                Create Product
              </Button>
            )}
          </div>
        ) : (
          !isLoading && (
            <>
              {/* Sorting indicator */}
              {sortBy && (
                <div className="mb-4">
                  <Badge
                    variant="secondary"
                    className="flex items-center gap-1 w-fit"
                  >
                    Sorted by {sortBy}{" "}
                    {sortOrder === "asc" ? "(Low to High)" : "(High to Low)"}
                  </Badge>
                </div>
              )}

              <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-6 mb-8">
                {products.map((product) => (
                  <Card
                    key={product.id}
                    className="hover:shadow-lg transition-shadow duration-200"
                  >
                    <CardHeader className="pb-3">
                      <div className="flex justify-between items-start">
                        <CardTitle className="text-lg font-semibold text-gray-900 line-clamp-2">
                          {product.name}
                        </CardTitle>
                        <Badge variant="secondary" className="ml-2 shrink-0">
                          {product.category}
                        </Badge>
                      </div>
                    </CardHeader>
                    <CardContent className="space-y-4">
                      <p className="text-gray-600 text-sm line-clamp-3">
                        {product.description}
                      </p>
                      <div className="flex justify-between items-center">
                        <div className="space-y-1">
                          <div className="text-2xl font-bold text-green-600">
                            ${product.price.toFixed(2)}
                          </div>
                          <div className="text-sm text-gray-500">
                            Qty: {product.quantity}
                          </div>
                        </div>
                      </div>
                      <div className="flex gap-2 pt-2">
                        <Button
                          variant="outline"
                          size="sm"
                          onClick={() => handleViewProduct(product)}
                          className="flex-1 flex items-center gap-1"
                        >
                          <Eye className="w-4 h-4" />
                          View
                        </Button>
                        <Button
                          variant="outline"
                          size="sm"
                          onClick={() => handleEditProduct(product)}
                          className="flex-1 flex items-center gap-1"
                        >
                          <Edit className="w-4 h-4" />
                          Edit
                        </Button>
                        <AlertDialog>
                          <AlertDialogTrigger asChild>
                            <Button
                              variant="outline"
                              size="sm"
                              className="flex-1 flex items-center gap-1"
                            >
                              <Trash2 className="w-4 h-4" />
                              Delete
                            </Button>
                          </AlertDialogTrigger>
                          <AlertDialogContent>
                            <AlertDialogHeader>
                              <AlertDialogTitle>
                                Delete Product
                              </AlertDialogTitle>
                              <AlertDialogDescription>
                                Are you sure you want to delete "{product.name}
                                "? This action cannot be undone.
                              </AlertDialogDescription>
                            </AlertDialogHeader>
                            <AlertDialogFooter>
                              <AlertDialogCancel>Cancel</AlertDialogCancel>
                              <AlertDialogAction
                                onClick={() => handleDeleteProduct(product)}
                                className="bg-red-600 hover:bg-red-700"
                              >
                                Delete
                              </AlertDialogAction>
                            </AlertDialogFooter>
                          </AlertDialogContent>
                        </AlertDialog>
                      </div>
                    </CardContent>
                  </Card>
                ))}
              </div>

              {totalPages >= 1 && (
                <div className="flex justify-center items-center gap-2">
                  <Button
                    variant="outline"
                    size="sm"
                    onClick={() => handlePageChange(currentPage - 1)}
                    disabled={currentPage === 1}
                  >
                    Previous
                  </Button>

                  {Array.from({ length: totalPages }, (_, i) => i + 1).map(
                    (page) => (
                      <Button
                        key={page}
                        variant={currentPage === page ? "default" : "outline"}
                        size="sm"
                        onClick={() => handlePageChange(page)}
                        className="w-10"
                      >
                        {page}
                      </Button>
                    )
                  )}

                  <Button
                    variant="outline"
                    size="sm"
                    onClick={() => handlePageChange(currentPage + 1)}
                    disabled={currentPage === totalPages}
                  >
                    Next
                  </Button>
                </div>
              )}
            </>
          )
        )}

        {/* Product Modal */}
        <ProductModal
          isOpen={isModalOpen}
          onClose={() => setIsModalOpen(false)}
          onSave={handleSaveProduct}
          mode={modalMode}
          product={selectedProduct}
        />
      </div>
    </div>
  );
};

export default Index;
