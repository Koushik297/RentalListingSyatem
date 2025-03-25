const express = require("express");
const router = express.Router();
const wrapAsync = require("../utils/wrapAsync.js");
const Listing = require("../models/listing.js");
const { isLoggedIn, isOwner, validateListing } = require("../middleware.js");
const listingController = require("../controllers/listing.js");
const { upload, uploadToCloudinary } = require("../cloudConfig.js");

// Index Route

router
  .route("/")
  .get(wrapAsync(listingController.index))
  .post(
    isLoggedIn,
    upload.single('listing[image]'),
    async (req, res, next) => {
      try {
        if (req.file) {
          req.body.listing.image = await uploadToCloudinary(req.file); // Upload and set image URL
        }
        next();
      } catch (error) {
        next(error);
      }
    },
    validateListing,
    wrapAsync(listingController.createListing)
  );
  

//New Route

router.get("/new", isLoggedIn, listingController.renderNewForm);

router
  .route("/:id")
  .get(wrapAsync(listingController.showListing))
  .put(
    isLoggedIn,
    isOwner,
    upload.single('listing[image]'),
    async (req, res, next) => {
      try {
        if (req.file) {
          req.body.listing.image = await uploadToCloudinary(req.file);
        }
        next();
      } catch (error) {
        next(error);
      }
    },
    validateListing,
    wrapAsync(listingController.updateListing)
  )
  .delete(
    isLoggedIn,
    isOwner,
    wrapAsync(listingController.destroyListing)
  );

// EDit Route
router.get(
  "/:id/edit",
  isLoggedIn,
  isOwner,
  wrapAsync(listingController.renderEditForm)
);




module.exports = router;
