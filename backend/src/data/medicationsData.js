const { v4: uuidv4 } = require("uuid");
const db = require("../config/db");

const sqliteMethodAsync = (method, sql, params) =>
  new Promise((resolve, reject) => {
    if (typeof db[method] !== "function") {
      return reject(new Error(`Method ${method} is not valid db function`));
    }

    db[method](sql, params, (err, row) => {
      if (err) reject(err);

      if (method === "run") {
        return resolve({ lastId: this.lastId, changes: this.changes });
      } else resolve(row);
    });
  });

const getAllMedications = async () => {
      try {
          const query = `select *from medications;`
          const result = await sqliteMethodAsync("all", query)
          
          return result ? result : [];
      } catch (err) {
        console.log(err)
      }
}

const getMedicationById = async (id) => {
    try {
        const query = `select * from medications where id = ?`      
        const result = await sqliteMethodAsync("get", query, [id]);
        return result ? result : null;
    } catch (err) {
        console.log(err);
        return null;
    }
}

const deleteMedication = async (id) => {
    try {
        const medicationExist = await getMedicationById(id);

        if (!medicationExist) {
            return {
                success: false,
                message: "Medication not found",
            };
      }
        const query = `delete from medications where id=?`
        const result = await sqliteMethodAsync("run", query, [id]);

        return {
            success:true,
            message:"Medication deleted Successfully"
        }
    } catch (err) {
        console.log(err)
    }
}

const createMedication =async (med) => {
    const { name, userid, dosage, frequency } = med
    try {
        const query =
          "INSERT INTO medications (id,userid,name,dosage,frequency) VALUES (?,?,?,?,?)";
        const result = await sqliteMethodAsync("run", query, [
          uuidv4(),
            userid,
            name,
            dosage,
            frequency
        ]);
    
        if (result.changes === 0) {
          return {
            success: false,
            message: "Failed to add medication",
          };
        }

        return {
          success: true,
          message: "Medication Added Successfully",
        };
      } catch (err) {
        console.log(err);
      }
}

const updateMedication =async (med) => {
    const { id,name, userid, dosage, frequency } = med
    try {
        const medicationExist = await getMedicationById(id);

        if (!medicationExist) {
            return {
                success: false,
                message: "Medication not found",
            };
        }
        
        const query =
          "UPDATE medications SET userid=?, name=?, dosage=?,frequency=? WHERE id=?";
        const result = await sqliteMethodAsync("run", query, [
            userid,
            name,
            dosage,
            frequency,
            id
        ]);
    
        return {
          success: true,
          message: "Medication Updated Successfully",
        };
      } catch (err) {
        console.log(err);
      }
}

module.exports = {createMedication,getAllMedications,updateMedication,deleteMedication}