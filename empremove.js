const Express = require("express");
const router = Express.Router();
const { mongodbemp, datamodel } = require("./mongodb.js");

router.delete("/", async (req, res) => {
  const { mail } = req.body;
  console.log("Request to delete:", mail);

  if (!mail) {
    return res.status(400).json({ message: "⚠️ Email is required" });
  }

  try {
    const employee = await mongodbemp.findOne({ Email: mail });

    if (!employee) {
      return res.status(404).json({ message: "⚠️ User Not Found" });
    }


    const dataDelete = await datamodel.deleteMany({ Employee_ID: employee._id });


    const empDelete = await mongodbemp.deleteOne({ _id: employee._id });

    console.log(`Deleted employee ${mail} and ${dataDelete.deletedCount} related work logs`);
    res.status(200).json({ message: "✅ Employee and related data deleted" });

  } catch (err) {
    console.error("❌ Error during delete:", err);
    res.status(500).json({ message: "❌ Server error" });
  }
});

module.exports = router;
