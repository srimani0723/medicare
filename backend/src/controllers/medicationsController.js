const e = require("express");
const { getAllMedications, deleteMedication, createMedication, updateMedication } = require("../data/medicationsData");

const getAllMedicationsController =async (req, res) => {
    try {
        const result =await getAllMedications(req.body)

        res.status(200).json({
            status: true,
            medications:result
        })
    } catch (error) {
    res.status(500).json({
      error: "Something Went Wrong "+ error.message
    });
    }
}

const deleteMedicationController =async (req, res) => {
    try {
        const {id} = req.params
        const result = await deleteMedication(id)
        res.status(200).json(result)
    } catch (error) {
        res.status(500).json({
      error: "Something Went Wrong "+ error.message
    });
    }
}

const createMedicationController =async (req, res) => {
    try {
        const { name, userid, dosage, frequency } = req.body

        if (!name || !userid || !dosage || !frequency) {
            return res.status(400).json({
                status: false,
                error:"Details Required"
            })
        }
        const result = await createMedication(req.body)
        res.status(200).json(result)
    } catch (error) {
        res.status(500).json({
      error: "Something Went Wrong "+ error.message
    });
    }
}

const updateMedicationController = async (req, res) => {
    try {
        const { name, userid, dosage, frequency } = req.body
        const { id } = req.params

        if (!id || !name || !userid || !dosage || !frequency) {
            return res.status(400).json({
                status: false,
                error:"Details Required"
            })
        }
        const result = await updateMedication({id:id,...req.body })
        res.status(200).json(result)
    } catch (error) {
        res.status(500).json({
            error: "Something Went Wrong "+ error.message
    });
    }
}

module.exports = {getAllMedicationsController,deleteMedicationController,createMedicationController,updateMedicationController}