import { onlyUser } from "../index";
import * as PdfController from "../controllers/pdfController";
import * as LabelController from "../controllers/labelController";

const router = require("express").Router();

router.use("/protocols", require("./protocols/protocol-routes"));

router.post("/labels", onlyUser(), LabelController.postLabels);
router.get("/labels", onlyUser(), LabelController.getLabels);

router.use("/devices", require("./devices/device-routes"));

router.use("/workees", require("./workees/workee-routes"));

router.get("/templatetopdf/:id", onlyUser(), PdfController.templateToPdf);

module.exports = router;
