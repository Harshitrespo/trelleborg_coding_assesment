import React, { useState, useEffect } from "react";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Textarea } from "@/components/ui/textarea";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";
import {
  Dialog,
  DialogContent,
  DialogHeader,
  DialogTitle,
} from "@/components/ui/dialog";
import { Product } from "@/interface";

interface ProductModalProps {
  isOpen: boolean;
  onClose: () => void;
  onSave: (product: Omit<Product, "id">) => void;
  mode: "create" | "edit" | "view";
  product?: Product | null;
}

interface FormErrors {
  name?: string;
  quantity?: string;
  price?: string;
  description?: string;
  category?: string;
}

const categories = [
  "Electronics",
  "Home & Kitchen",
  "Office",
  "Sports",
  "Books",
  "Clothing",
  "Toys",
  "Health & Beauty",
  "Automotive",
  "Garden",
];

const ProductModal: React.FC<ProductModalProps> = ({
  isOpen,
  onClose,
  onSave,
  mode,
  product,
}) => {
  const [formData, setFormData] = useState({
    name: "",
    quantity: "",
    price: "",
    description: "",
    category: "",
  });
  const [errors, setErrors] = useState<FormErrors>({});
  const [isSubmitting, setIsSubmitting] = useState(false);

  // Initialize form data when modal opens
  useEffect(() => {
    if (isOpen) {
      if (product && (mode === "edit" || mode === "view")) {
        setFormData({
          name: product.name,
          quantity: product.quantity.toString(),
          price: product.price.toString(),
          description: product.description,
          category: product.category,
        });
      } else {
        setFormData({
          name: "",
          quantity: "",
          price: "",
          description: "",
          category: "",
        });
      }
      setErrors({});
    }
  }, [isOpen, product, mode]);

  const validateForm = () => {
    const newErrors: FormErrors = {};

    if (mode === "create") {
      // All fields required for creation
      if (!formData.name.trim()) {
        newErrors.name = "Product name is required";
      }

      if (!formData.quantity.trim()) {
        newErrors.quantity = "Quantity is required";
      } else if (
        isNaN(Number(formData.quantity)) ||
        Number(formData.quantity) < 0
      ) {
        newErrors.quantity = "Quantity must be a valid number";
      }

      if (!formData.price.trim()) {
        newErrors.price = "Price is required";
      } else if (isNaN(Number(formData.price)) || Number(formData.price) < 0) {
        newErrors.price = "Price must be a valid number";
      }

      if (!formData.description.trim()) {
        newErrors.description = "Description is required";
      }

      if (!formData.category.trim()) {
        newErrors.category = "Category is required";
      }
    } else if (mode === "edit") {
      // For edit, only validate filled fields
      if (
        formData.quantity.trim() &&
        (isNaN(Number(formData.quantity)) || Number(formData.quantity) < 0)
      ) {
        newErrors.quantity = "Quantity must be a valid number";
      }

      if (
        formData.price.trim() &&
        (isNaN(Number(formData.price)) || Number(formData.price) < 0)
      ) {
        newErrors.price = "Price must be a valid number";
      }
    }

    setErrors(newErrors);
    return Object.keys(newErrors).length === 0;
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();

    if (mode === "view") return;

    if (!validateForm()) return;

    setIsSubmitting(true);

    try {
      const productData = {
        name: formData.name.trim() || product?.name || "",
        quantity: formData.quantity.trim()
          ? Number(formData.quantity)
          : product?.quantity || 0,
        price: formData.price.trim()
          ? Number(formData.price)
          : product?.price || 0,
        description: formData.description.trim() || product?.description || "",
        category: formData.category.trim() || product?.category || "",
      };

      onSave(productData);
    } finally {
      setIsSubmitting(false);
    }
  };

  const handleInputChange = (field: string, value: string) => {
    setFormData((prev) => ({ ...prev, [field]: value }));
    // Clear error when user starts typing
    if (errors[field as keyof FormErrors]) {
      setErrors((prev) => ({ ...prev, [field]: undefined }));
    }
  };

  const getModalTitle = () => {
    switch (mode) {
      case "create":
        return "Create Product";
      case "edit":
        return "Edit Product";
      case "view":
        return "View Product";
      default:
        return "Product";
    }
  };

  const isReadOnly = mode === "view";

  return (
    <Dialog open={isOpen} onOpenChange={onClose}>
      <DialogContent className="sm:max-w-[600px] max-h-[90vh] overflow-y-auto">
        <DialogHeader>
          <DialogTitle className="text-xl font-semibold">
            {getModalTitle()}
          </DialogTitle>
        </DialogHeader>

        <form onSubmit={handleSubmit} className="space-y-6 mt-4">
          {/* Product Name */}
          <div className="space-y-2">
            <Label htmlFor="name" className="text-sm font-medium">
              Product Name{" "}
              {mode === "create" && <span className="text-red-500">*</span>}
            </Label>
            <Input
              id="name"
              value={formData.name}
              onChange={(e) => handleInputChange("name", e.target.value)}
              placeholder="Enter product name"
              readOnly={isReadOnly}
              className={errors.name ? "border-red-500" : ""}
            />
            {errors.name && (
              <p className="text-red-500 text-sm">{errors.name}</p>
            )}
          </div>

          {/* Quantity and Price */}
          <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
            <div className="space-y-2">
              <Label htmlFor="quantity" className="text-sm font-medium">
                Quantity{" "}
                {mode === "create" && <span className="text-red-500">*</span>}
              </Label>
              <Input
                id="quantity"
                type="number"
                min="0"
                value={formData.quantity}
                onChange={(e) => handleInputChange("quantity", e.target.value)}
                placeholder="0"
                readOnly={isReadOnly}
                className={errors.quantity ? "border-red-500" : ""}
              />
              {errors.quantity && (
                <p className="text-red-500 text-sm">{errors.quantity}</p>
              )}
            </div>

            <div className="space-y-2">
              <Label htmlFor="price" className="text-sm font-medium">
                Price ($){" "}
                {mode === "create" && <span className="text-red-500">*</span>}
              </Label>
              <Input
                id="price"
                type="number"
                min="0"
                step="0.01"
                value={formData.price}
                onChange={(e) => handleInputChange("price", e.target.value)}
                placeholder="0.00"
                readOnly={isReadOnly}
                className={errors.price ? "border-red-500" : ""}
              />
              {errors.price && (
                <p className="text-red-500 text-sm">{errors.price}</p>
              )}
            </div>
          </div>

          {/* Category */}
          <div className="space-y-2">
            <Label htmlFor="category" className="text-sm font-medium">
              Category{" "}
              {mode === "create" && <span className="text-red-500">*</span>}
            </Label>
            {isReadOnly ? (
              <Input
                value={formData.category}
                readOnly
                className="bg-gray-50"
              />
            ) : (
              <Select
                value={formData.category}
                onValueChange={(value) => handleInputChange("category", value)}
              >
                <SelectTrigger
                  className={errors.category ? "border-red-500" : ""}
                >
                  <SelectValue placeholder="Select a category" />
                </SelectTrigger>
                <SelectContent>
                  {categories.map((category) => (
                    <SelectItem key={category} value={category}>
                      {category}
                    </SelectItem>
                  ))}
                </SelectContent>
              </Select>
            )}
            {errors.category && (
              <p className="text-red-500 text-sm">{errors.category}</p>
            )}
          </div>

          {/* Description */}
          <div className="space-y-2">
            <Label htmlFor="description" className="text-sm font-medium">
              Description{" "}
              {mode === "create" && <span className="text-red-500">*</span>}
            </Label>
            <Textarea
              id="description"
              value={formData.description}
              onChange={(e) => handleInputChange("description", e.target.value)}
              placeholder="Enter product description"
              rows={4}
              readOnly={isReadOnly}
              className={errors.description ? "border-red-500" : ""}
            />
            {errors.description && (
              <p className="text-red-500 text-sm">{errors.description}</p>
            )}
          </div>

          {/* Buttons */}
          <div className="flex gap-3 pt-4">
            <Button
              type="button"
              variant="outline"
              onClick={onClose}
              className="flex-1"
            >
              {mode === "view" ? "Close" : "Cancel"}
            </Button>
            {!isReadOnly && (
              <Button type="submit" disabled={isSubmitting} className="flex-1">
                {isSubmitting
                  ? "Saving..."
                  : mode === "create"
                  ? "Create Product"
                  : "Update Product"}
              </Button>
            )}
          </div>
        </form>
      </DialogContent>
    </Dialog>
  );
};

export default ProductModal;
