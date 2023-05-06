import expressAsyncHandler from 'express-async-handler';
import Product from '../models/Product.js';

// @desc    Create new product
// @route   POST /api/v1/product
// @access  Private/Admin
export const createProductCtrl = expressAsyncHandler(async (req, res) => {
	const {
		name,
		description,
		category,
		sizes,
		colors,
		user,
		images,
		price,
		totalQty,
		brand,
	} = req.body;

	// Check if product already exists
	const productExists = await Product.findOne({ name });
	if (productExists) {
		throw new Error('Product already exists');
	}
	// Create new product
	const product = await Product.create({
		name,
		description,
		category,
		sizes,
		colors,
		user: req.userAuthId,
		images,
		price,
		totalQty,
		brand,
	});
	// Push the product into category
	res.json({
		status: 'success',
		message: 'Product created successfully',
		product,
	});
});

// @desc    Get all products
// @route   POST /api/v1/products
// @access  Public
export const getProductsCtrl = expressAsyncHandler(async (req, res) => {
	let productQuery = Product.find();

	// filter products by name
	if (req.query.name) {
		productQuery = productQuery.find({
			name: {
				$regex: req.query.name,
				$options: 'i',
			},
		});
	}
	// filter products by brand
	if (req.query.brand) {
		productQuery = productQuery.find({
			brand: {
				$regex: req.query.brand,
				$options: 'i',
			},
		});
	}
	// filter products by category
	if (req.query.category) {
		productQuery = productQuery.find({
			category: {
				$regex: req.query.category,
				$options: 'i',
			},
		});
	}
	// filter products by color
	if (req.query.colors) {
		productQuery = productQuery.find({
			colors: {
				$regex: req.query.colors,
				$options: 'i',
			},
		});
	}
	// filter products by color
	if (req.query.size) {
		productQuery = productQuery.find({
			sizes: {
				$regex: req.query.size,
				$options: 'i',
			},
		});
	}
	// filter products by price range
	if (req.query.price) {
		const priceRange = req.query.price.split('-');
		// gte: greater than or equal to
		// lte: smaller than or equal to
		productQuery = productQuery.find({
			price: { $gte: priceRange[0], $lte: priceRange[1] },
		});
	}
	//pagination
	// page
	const page = parseInt(req.query.page) ? parseInt(req.query.page) : 1;
	// limit
	const limit = parseInt(req.query.limit) ? parseInt(req.query.limit) : 10;
	// start Index
	const startIndex = (page - 1) * limit;
	// end Index
	const endIndex = page * limit;
	// total products
	const total = await Product.countDocuments();
	productQuery = productQuery.skip(startIndex).limit(limit);
	// pagination results
	let pagination = {};
	if (endIndex < total) {
		pagination.next = {
			page: page + 1,
			limit,
		};
	}
	if (startIndex > 0) {
		pagination.prev = {
			page: page - 1,
			limit,
		};
	}

	// awaiting the query
	const products = await productQuery;

	res.json({
		status: 'success',
		products,
		results: products.length,
		pagination,
		total,
		message: 'Products fetched successfully',
	});
});

// @desc    Get single product
// @route   POST /api/v1/products/:id
// @access  Public
export const getSingleProductCtrl = expressAsyncHandler(async (req, res) => {
	const product = await Product.findById(req.params.id);
	if (!product) {
		throw new Error('Product not found');
	} else {
		res.json({
			status: 'success',
			message: 'Product fetched successfully',
			product,
		});
	}
});

// @desc    Update product
// @route   POST /api/v1/products/:id/update
// @access  Private/Admin
export const updateProductCtrl = expressAsyncHandler(async (req, res) => {
	const {
		name,
		description,
		category,
		sizes,
		colors,
		user,
		images,
		price,
		totalQty,
		brand,
	} = req.body;
	// update
	const product = await Product.findByIdAndUpdate(
		req.params.id,
		{
			name,
			description,
			category,
			sizes,
			colors,
			user,
			images,
			price,
			totalQty,
		},
		{
			new: true,
		}
	);

	res.json({
		status: 'success',
		message: 'Product updated successfully',
		product,
	});
});