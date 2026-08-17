<?php

namespace App\Http\Controllers;

use Illuminate\Http\Request;
use App\Models\Product;
use Illuminate\Support\Facades\Storage;
class ProductController extends Controller
{
    /**
     * Display a listing of the resource.
     */
    public function index()
    {
        $user_id = auth()->user()->id;
        $products = Product::where('user_id', $user_id)->get()->map(function($product){
            $product->banner_image = $product->banner_image? asset(Storage::url($product->banner_image)) : null;
            return $product;
        });
        return response()->json([
            'status' => true,
            'message' => 'Products fetched successfully',
            'products' => $products
        ], 200);
    }

    /**
     * Store a newly created resource in storage.
     */
    public function store(Request $request)
    {
        $data = $request->validate([
            'title' => 'required',
        ]);

        $data['description'] = $request->description;
        $data['cost'] = $request->cost;

        $data['user_id'] = auth()->user()->id;
       if($request->hasFile('banner_image')){
        $data['banner_image'] = $request->file('banner_image')->store('products', 'public');
       }
       $product = Product::create($data);
       return response()->json([
        'status' => true,
        'message' => 'Product created successfully',
        'product' => $product
       ], 200);
    }

    /**
     * Display the specified resource.
     */
    public function show(Product $product)
    {
        if(!$product){
            return response()->json([
                'status' => false,
                'message' => 'Product not found'
            ], 404);
        }
        return response()->json([
            'status' => true,
            'message' => 'Product fetched successfully',
            'product' => $product
        ], 200);
    }

    /**
     * Update the specified resource in storage.
     */
    public function update(Request $request, Product $product)
    {
        $data = $request->validate([
            'title' => 'required',
        ]);
        $data['description'] = isset($request->description) ? $request->description : $product->description;
        $data['cost'] = isset($request->cost) ? $request->cost : $product->cost;
        
        if($request->hasFile('banner_image')){
            if($product->banner_image){
                Storage::disk('public')->delete($product->banner_image);
            }
            $data['banner_image'] = $request->file('banner_image')->store('products', 'public');
        }
        if(!$product){
            return response()->json([
                'status' => false,
                'message' => 'Product not found'
            ], 404);
        }
        $product->update($data);
        return response()->json([
            'status' => true,
            'message' => 'Product updated successfully',
            'product' => $product
        ], 200);
    }

    /**
     * Remove the specified resource from storage.
     */
    public function destroy(Product $product)
    {
        if(!$product){
            return response()->json([
                'status' => false,
                'message' => 'Product not found'
            ], 404);
        }
        $product->delete();
        return response()->json([
            'status' => true,
            'message' => 'Product deleted successfully'
        ], 200);
    }
}
