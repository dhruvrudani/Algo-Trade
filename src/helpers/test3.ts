import { Request, Response } from 'express';
import multer from 'multer';
import csv from 'csv-parser';
import fs from 'fs';
import { csvTojson } from "../database/model/csvTojson"; // Import csvTojson
import { unlink } from 'fs/promises'; // Node 14+ or use `fs-extra` for older versions

const upload = multer({ dest: 'uploads/' });

export async function test3(req: Request, res: Response) {
    try {
        const file = (req as any).file;
        const body = req.query;

        if (!file) {
            return res.status(400).json({ error: "No file uploaded" });
        }

        // Ensure body.store is a string
        const store = String(body.store);

        // Validate store value
        const validStores = ["sensex", "finNifty", "midcpNifty", "nifty", "bankNifty"];
        if (!validStores.includes(store)) {
            return res.status(400).json({ error: "Invalid store value" });
        }

        // Process CSV file
        const jsonData = await convertCsvFileFunction(file);

        // Find existing record in MongoDB
        let existingData = await csvTojson.findOne({});
        if (!existingData) {
            existingData = new csvTojson({});
        }

        // Update the specific key with new data
        existingData[store] = jsonData;

       
        await existingData.save();

                                              // Cleanup: Remove the uploaded file from the server
        await unlink(file.path);

        return res.status(200).json({ message: "CSV data added successfully", data: jsonData });
    } catch (error) {
        console.error("Error:", error);
        return res.status(500).json({ error: "Internal server error", message: error.message });
    }
}


async function convertCsvFileFunction(file: Express.Multer.File): Promise<any[]> {
    return new Promise((resolve, reject) => {
        const results: any[] = [];
        fs.createReadStream(file.path)
            .pipe(csv())
            .on('data', (data) => results.push(data)) 
            .on('end', () => resolve(results))
            .on('error', (error) => reject(error));
    });
}

export default upload; // Export multer instance if needed
