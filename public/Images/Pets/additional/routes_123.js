//import express, express router as shown in lecture code
import { Router } from 'express';
const router = Router();
import { product, cartItems, addCart, checkout, addProduct } from '../data/pet_shop.js'
import { postDetails, createPost, addComment } from '../data/community.js';
import { costEstimation } from '../data/cost_estimator.js';
import { healthData } from '../data/pet-health.js'
router.route('/').get(async (req, res) => {
  //code here for GET THIS ROUTE SHOULD NEVER FIRE BECAUSE OF MIDDLEWARE #1 IN SPECS.
  return res.json({error: 'YOU SHOULD NOT BE HERE!'});
});

router
  .route('/register')
  .get(async (req, res) => {
    //code here for GET
    return res.render('questionnaire', { title: 'Questionnaire' });
  })
  .post(async (req, res) => {
    //code here for POST
    console.log("Works");
    console.log(req.body.q1);
    return res.render('logout', { title: 'done' });
  });

router
  .route('/login')
  .get(async (req, res) => {
    //code here for GET
  })
  .post(async (req, res) => {
    //code here for POST
  });

router.route('/protected').get(async (req, res) => {
  //code here for GET
});

router.route('/admin').get(async (req, res) => {
  //code here for GET
});

router.route('/error').get(async (req, res) => {
  //code here for GET
});

router.route('/logout').get(async (req, res) => {
  //code here for GET
});

router.route('/products').get(async (req, res) => {
  try {
    const productDetails = await product()
    console.log(productDetails, '>>>>>>>>>>>product')
    return res.render('shop', {products: productDetails})
  } catch (error) {
    console.log(error)
  }
}).post(async (req, res) => {
  try {
    const product = req.body
    const add = await addProduct(product)
    console.log(add)
    return add
  } catch (error) {
    console.log(error)    
  }
})

router.route('/cart').get(async (req, res) => {
  try {
    const cartList = await cartItems()
    console.log(cartList)
    return res.render('cart', {cartItems: cartList})
  } catch (error) {
    console.log(error)
  }
}).post(async (req, res) => {
  try {
    const cartDetail = req.body
    console.log(cartDetail)
    const cartItem = await addCart(cartDetail)
    console.log(cartItem)
    return res.render('cart', {cartItems: cartItem})
  } catch (error) {
    console.log(error)
  }
})

router.route('/checkout').get(async (req, res) => {
  try {
    const progress = await checkout()
    console.log(progress)
  } catch (error) {
    console.log(error)
  }
})

router.route('/community-post').get(async (req, res) => {
  try {
    const post = await postDetails()
    console.log(post)
    // res.send(post)
    return res.render('community', {posts: post})
  } catch (error) {
    console.log(error)
  }
}).post(async (req, res) => {
  try {
    const postData = req.body
    const postDetail = await createPost(postData)
    console.log(postDetail)
  } catch (error) {
    console.log(error)
  }
})

router.route('/comment/:postId').post(async (req, res) => {
  try {
    const commentData = req.body
    const postId = req.params.postId
    const commentDetails = await addComment(commentData, postId)
    console.log(commentDetails)
  } catch (error) {
    console.log(error)
  }
})

router.route('/pet/health').post(async (req, res) => {
  try {
    const health = req.body
    const healthDetail = await healthData(health)
    console.log(healthDetail)
    return res.send('added successfully')
  } catch (error) {
    console.log(error)
  }
}).get(async (req, res) => {
  try {
    return res.render('petHealth')
  } catch (error) {
    console.log(error)
  }
})

router.route('/cost-estimation').post(async (req, res) => {
  try {
    const costData = req.body
    const costDetails = await costEstimation(costData)
    console.log(costDetails)
  } catch (error) {
    console.log(error)
  }
}).get(async (req, res) => {
  try {
    return res.render('cost')
  } catch (error) {
    console.log(error)
  }
})

export default router;