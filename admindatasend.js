
const express = require("express");
const { mongodbemp, datamodel } = require("./mongodb");
const router = express.Router();


router.get("/employees", async (req, res) => {
  try {
    const employees = await mongodbemp.find({}, "name Email Role"); 
    console.log(employees)
    res.json(employees);
  } catch (e) {
    res.status(500).json({ message: "Error fetching employees" });
  }
});


router.get("/employeeData", async (req, res) => {
  const { email } = req.query;
  try {
    const emp = await mongodbemp.findOne({ Email: email });
    if (!emp) return res.status(404).json({ message: "Employee not found" });

    const data = await datamodel.find({ Employee_ID: emp._id }).sort({ date: -1 });
    const response = data.map(d => ({
      ...d._doc,
      employeeName: emp.name,
    }));

    res.json(response);
  } catch (e) {
    res.status(500).json({ message: "Error fetching data" });
  }
});

module.exports = router;
