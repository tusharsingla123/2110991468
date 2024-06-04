'use client';

import { useState, useMemo, useEffect } from 'react';
import { Checkbox } from '@/components/ui/checkbox';
import { Label } from '@/components/ui/label';
import {
    DropdownMenu,
    DropdownMenuTrigger,
    DropdownMenuContent,
    DropdownMenuRadioGroup,
    DropdownMenuRadioItem,
} from '@/components/ui/dropdown-menu';
import { Button } from '@/components/ui/button';
import Link from 'next/link';
import { Pagination } from '@/components/ui/pagination';
import { Icon } from 'lucide-react';
import axios from 'axios';

export default function Component() {
    const [filters, setFilters] = useState({
        category: [] as Categories[],
        company: [] as Companies[],
        rating: [] as number[],
        priceRange: [0, 1000],
        availability: true,
    });
    const [sortBy, setSortBy] = useState('price');
    const [sortOrder, setSortOrder] = useState('asc');
    const [currentPage, setCurrentPage] = useState(1);
    const [productsPerPage, setProductsPerPage] = useState(12);
    const [products, setProducts] = useState<Product[]>([]);

    useEffect(() => {
        axios
            .get(
                `http://20.244.56.144/test/companies/AMZ/categories/Laptop/products?top=10&minPrice=1&maxPrice=10000`,
                {
                    headers: {
                        'Content-Type': 'application/json',
                        Authorization: `Bearer eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJNYXBDbGFpbXMiOnsiZXhwIjoxNzE3NTE2MzU2LCJpYXQiOjE3MTc1MTYwNTYsImlzcyI6IkFmZm9yZG1lZCIsImp0aSI6ImE2ZWEyNDk1LWU3YjktNGQwZC04YWJmLTMxMzMyN2I5YzhlNiIsInN1YiI6InR1c2hhcjE0NjguYmUyMUBjaGl0YXJhLmVkdS5pbiJ9LCJjb21wYW55TmFtZSI6IkNoaXRrYXJhIHVuaXZlcnNpdHkiLCJjbGllbnRJRCI6ImE2ZWEyNDk1LWU3YjktNGQwZC04YWJmLTMxMzMyN2I5YzhlNiIsImNsaWVudFNlY3JldCI6IndRSXZVd2p5amxLcFhtQ2giLCJvd25lck5hbWUiOiJUdXNoYXIgU2luZ2xhIiwib3duZXJFbWFpbCI6InR1c2hhcjE0NjguYmUyMUBjaGl0YXJhLmVkdS5pbiIsInJvbGxObyI6IjIxMTA5OTE0NjgifQ.H7LEgk71irGP4SMU6kBk48lOp6jafEwqg0I-ABdE5q4`,
                    },
                }
            )
            .then((response) => {
                setProducts(response.data);
            })
            .catch((error) => {
                console.error('Error:', error);
            });
    }, []);
    const filteredProducts = useMemo(() => {
        return products
            .filter((product) => {
                if (
                    filters.category.length > 0 &&
                    !filters.category.includes(product?.category)
                ) {
                    return false;
                }
                if (
                    filters.company.length > 0 &&
                    !filters.company.includes(product?.company)
                ) {
                    return false;
                }
                if (
                    filters.rating.length > 0 &&
                    !filters.rating.includes(
                        Math.floor(product.rating)
                    )
                ) {
                    return false;
                }
                if (
                    product.price < filters.priceRange[0] ||
                    product.price > filters.priceRange[1]
                ) {
                    return false;
                }
                if (filters.availability && !product.available) {
                    return false;
                }
                return true;
            })
            .sort((a, b) => {
                switch (sortBy) {
                    case 'price':
                        return sortOrder === 'asc'
                            ? a.price - b.price
                            : b.price - a.price;
                    case 'rating':
                        return sortOrder === 'asc'
                            ? a.rating - b.rating
                            : b.rating - a.rating;
                    case 'discount':
                        return sortOrder === 'asc'
                            ? a.discount - b.discount
                            : b.discount - a.discount;
                    default:
                        return 0;
                }
            });
    }, [filters, sortBy, sortOrder]);
    const indexOfLastProduct = currentPage * productsPerPage;
    const indexOfFirstProduct = indexOfLastProduct - productsPerPage;
    const currentProducts = filteredProducts.slice(
        indexOfFirstProduct,
        indexOfLastProduct
    );
    const handleFilterChange = (type, value) => {
        setFilters((prevFilters) => {
            if (type === 'category') {
                return {
                    ...prevFilters,
                    category: prevFilters.category.includes(value)
                        ? prevFilters.category.filter(
                              (item) => item !== value
                          )
                        : [...prevFilters.category, value],
                };
            } else if (type === 'company') {
                return {
                    ...prevFilters,
                    company: prevFilters.company.includes(value)
                        ? prevFilters.company.filter(
                              (item) => item !== value
                          )
                        : [...prevFilters.company, value],
                };
            } else if (type === 'rating') {
                return {
                    ...prevFilters,
                    rating: prevFilters.rating.includes(value)
                        ? prevFilters.rating.filter(
                              (item) => item !== value
                          )
                        : [...prevFilters.rating, value],
                };
            } else if (type === 'priceRange') {
                return {
                    ...prevFilters,
                    priceRange: value,
                };
            } else if (type === 'availability') {
                return {
                    ...prevFilters,
                    availability: !prevFilters.availability,
                };
            }
            return prevFilters;
        });
    };
    const handleSortChange = (value) => {
        if (sortBy === value) {
            setSortOrder(sortOrder === 'asc' ? 'desc' : 'asc');
        } else {
            setSortBy(value);
            setSortOrder('asc');
        }
    };
    const handlePageChange = (page) => {
        setCurrentPage(page);
    };
    return (
        <div className="container mx-auto px-4 md:px-6 py-8">
            <div className="grid grid-cols-1 md:grid-cols-[300px_1fr] gap-8">
                <div className="bg-white dark:bg-gray-950 rounded-lg shadow-sm p-6">
                    <h2 className="text-lg font-semibold mb-4">
                        Filters
                    </h2>
                    <div className="grid gap-6">
                        <div>
                            <h3 className="text-base font-medium mb-2">
                                Category
                            </h3>
                            <div className="grid gap-2">
                                {[
                                    'Electronics',
                                    'Bags',
                                    'Clothing',
                                    'Outdoor',
                                ].map((category) => (
                                    <div
                                        key={category}
                                        className="flex items-center gap-2"
                                    >
                                        <Checkbox
                                            id={`category-${category}`}
                                            checked={filters.category.includes(
                                                category
                                            )}
                                            onChange={() =>
                                                handleFilterChange(
                                                    'category',
                                                    category
                                                )
                                            }
                                        />
                                        <Label
                                            htmlFor={`category-${category}`}
                                            className="font-normal"
                                        >
                                            {category}
                                        </Label>
                                    </div>
                                ))}
                            </div>
                        </div>
                        <div>
                            <h3 className="text-base font-medium mb-2">
                                Company
                            </h3>
                            <div className="grid gap-2">
                                {[
                                    'Beats',
                                    'Fossil',
                                    'H&M',
                                    'Coleman',
                                    'Apple',
                                    "Levi's",
                                    'Merrell',
                                    'Sony',
                                    'Coach',
                                    'Zara',
                                    'MSR',
                                ].map((company) => (
                                    <div
                                        key={company}
                                        className="flex items-center gap-2"
                                    >
                                        <Checkbox
                                            id={`company-${company}`}
                                            checked={filters.company.includes(
                                                company
                                            )}
                                            onChange={() =>
                                                handleFilterChange(
                                                    'company',
                                                    company
                                                )
                                            }
                                        />
                                        <Label
                                            htmlFor={`company-${company}`}
                                            className="font-normal"
                                        >
                                            {company}
                                        </Label>
                                    </div>
                                ))}
                            </div>
                        </div>
                        <div>
                            <h3 className="text-base font-medium mb-2">
                                Rating
                            </h3>
                            <div className="grid gap-2">
                                {[5, 4, 3, 2, 1].map((rating) => (
                                    <div
                                        key={rating}
                                        className="flex items-center gap-2"
                                    >
                                        <Checkbox
                                            id={`rating-${rating}`}
                                            checked={filters.rating.includes(
                                                rating
                                            )}
                                            onChange={() =>
                                                handleFilterChange(
                                                    'rating',
                                                    rating
                                                )
                                            }
                                        />
                                        <Label
                                            htmlFor={`rating-${rating}`}
                                            className="font-normal"
                                        >
                                            {rating} stars and above
                                        </Label>
                                    </div>
                                ))}
                            </div>
                        </div>
                        <div>
                            <h3 className="text-base font-medium mb-2">
                                Price Range
                            </h3>
                            <div />
                        </div>
                        <div className="flex items-center gap-2">
                            <Checkbox
                                id="availability"
                                checked={filters.availability}
                                onChange={() =>
                                    handleFilterChange('availability')
                                }
                            />
                            <Label
                                htmlFor="availability"
                                className="font-normal"
                            >
                                In Stock
                            </Label>
                        </div>
                    </div>
                </div>
                <div>
                    <div className="bg-white dark:bg-gray-950 rounded-lg shadow-sm p-6 mb-6">
                        <div className="flex items-center justify-between mb-4">
                            <h2 className="text-lg font-semibold">
                                All Products
                            </h2>
                            <DropdownMenu>
                                <DropdownMenuTrigger asChild>
                                    <Button
                                        variant="outline"
                                        className="flex items-center gap-2"
                                    >
                                        <ListOrderedIcon className="h-4 w-4" />
                                        Sort by
                                    </Button>
                                </DropdownMenuTrigger>
                                <DropdownMenuContent
                                    align="end"
                                    className="w-[200px]"
                                >
                                    <DropdownMenuRadioGroup
                                        value={sortBy}
                                        onValueChange={
                                            handleSortChange
                                        }
                                    >
                                        <DropdownMenuRadioItem value="price">
                                            Price
                                        </DropdownMenuRadioItem>
                                        <DropdownMenuRadioItem value="rating">
                                            Rating
                                        </DropdownMenuRadioItem>
                                        <DropdownMenuRadioItem value="discount">
                                            Discount
                                        </DropdownMenuRadioItem>
                                    </DropdownMenuRadioGroup>
                                </DropdownMenuContent>
                            </DropdownMenu>
                        </div>
                        <div className="grid sm:grid-cols-2 md:grid-cols-3 lg:grid-cols-4 gap-6">
                            {currentProducts.map((product) => (
                                <div
                                    key={product.id}
                                    className="bg-white dark:bg-gray-950 rounded-lg shadow-sm overflow-hidden"
                                >
                                    <Link href="#" prefetch={false}>
                                        <img
                                            src="/placeholder.svg"
                                            alt={product.name}
                                            width={400}
                                            height={300}
                                            className="w-full h-48 object-cover"
                                        />
                                        <div className="p-4">
                                            <h3 className="text-lg font-semibold mb-2">
                                                {product.name}
                                            </h3>
                                            <div className="flex items-center justify-between mb-2">
                                                <span className="text-gray-500 dark:text-gray-400">
                                                    {product.company}
                                                </span>
                                                <span className="text-primary font-semibold">
                                                    $
                                                    {product.price.toFixed(
                                                        2
                                                    )}
                                                </span>
                                            </div>
                                            <div className="flex items-center gap-2 mb-2">
                                                {[
                                                    ...Array(
                                                        Math.floor(
                                                            product.rating
                                                        )
                                                    ),
                                                ].map((_, i) => (
                                                    <StarIcon
                                                        key={i}
                                                        className="h-4 w-4 fill-primary"
                                                    />
                                                ))}
                                                {[
                                                    ...Array(
                                                        5 -
                                                            Math.floor(
                                                                product.rating
                                                            )
                                                    ),
                                                ].map((_, i) => (
                                                    <StarIcon className="h-4 w-4 fill-gray-300 dark:fill-gray-600" />
                                                ))}
                                                <span className="text-gray-500 dark:text-gray-400">
                                                    (
                                                    {product.rating.toFixed(
                                                        1
                                                    )}
                                                    )
                                                </span>
                                            </div>
                                            {product.discount > 0 && (
                                                <div className="flex items-center gap-2 text-gray-500 dark:text-gray-400">
                                                    <span className="line-through">
                                                        $
                                                        {(
                                                            product.price *
                                                            (1 -
                                                                product.discount)
                                                        ).toFixed(2)}
                                                    </span>
                                                    <span className="text-primary font-semibold">
                                                        {(
                                                            product.discount *
                                                            100
                                                        ).toFixed(0)}
                                                        % off
                                                    </span>
                                                </div>
                                            )}
                                            {product.available ? (
                                                <div className="text-green-500 font-semibold">
                                                    In Stock
                                                </div>
                                            ) : (
                                                <div className="text-red-500 font-semibold">
                                                    Out of Stock
                                                </div>
                                            )}
                                        </div>
                                    </Link>
                                </div>
                            ))}
                        </div>
                        <div className="flex justify-center mt-6">
                            <Pagination
                                currentPage={currentPage}
                                totalPages={Math.ceil(
                                    filteredProducts.length /
                                        productsPerPage
                                )}
                                onPageChange={handlePageChange}
                            />
                        </div>
                    </div>
                </div>
            </div>
        </div>
    );
}

function ListOrderedIcon(props: any) {
    return (
        <svg
            {...props}
            xmlns="http://www.w3.org/2000/svg"
            width="24"
            height="24"
            viewBox="0 0 24 24"
            fill="none"
            stroke="currentColor"
            strokeWidth="2"
            strokeLinecap="round"
            strokeLinejoin="round"
        >
            <line x1="10" x2="21" y1="6" y2="6" />
            <line x1="10" x2="21" y1="12" y2="12" />
            <line x1="10" x2="21" y1="18" y2="18" />
            <path d="M4 6h1v4" />
            <path d="M4 10h2" />
            <path d="M6 18H4c0-1 2-2 2-3s-1-1.5-2-1" />
        </svg>
    );
}

function StarIcon(props: any) {
    return (
        <svg
            {...props}
            xmlns="http://www.w3.org/2000/svg"
            width="24"
            height="24"
            viewBox="0 0 24 24"
            fill="none"
            stroke="currentColor"
            strokeWidth="2"
            strokeLinecap="round"
            strokeLinejoin="round"
        >
            <polygon points="12 2 15.09 8.26 22 9.27 17 14.14 18.18 21.02 12 17.77 5.82 21.02 7 14.14 2 9.27 8.91 8.26 12 2" />
        </svg>
    );
}
