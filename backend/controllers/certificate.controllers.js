import { fileURLToPath } from 'url';
import { dirname } from 'path';
import fs from 'fs';
import path from 'path';
import PDFDocument from 'pdfkit';
import EventModel from '../models/event.models.js';
import nodemailer from 'nodemailer'
import dotenv from 'dotenv'

dotenv.config()
export const generateCertificate = async (req, res) => {
    try {
        const __filename = fileURLToPath(import.meta.url);
        const __dirname = dirname(__filename);
        const { eventId } = req.params;

        const event = await EventModel.findById(eventId);
        const { registeredUsers } = event;

        const certificatePromises = registeredUsers.map((ele) => {
            return new Promise(async (resolve, reject) => {
                const doc = new PDFDocument({ size: [1600, 1131] });
                doc.registerFont('poppins', path.join(__dirname, '..', 'fonts', 'poppins.ttf'));
                doc.registerFont('roboto', path.join(__dirname, '..', 'fonts', 'roboto.ttf'));
                const fileName = `certificate_${ele.name.replace(/\s/g, "_")}.pdf`;
                const filePath = path.join(__dirname, "..", "cert-output", fileName);

                const bgImage = "Sample_Certificate.png";
                doc.image(path.join(__dirname, "..", "certificate", bgImage), 0, 0, {
                    width: 1600,
                    height: 1131,
                });

                const fontSizeName = 42;
                doc.font("poppins").fontSize(fontSizeName).fillColor("black");
                const nameWidth = doc.widthOfString(ele.name);
                const nameX = 825 - nameWidth / 2;
                const nameY = 360;
                doc.text(ele.name, nameX, nameY);

                const lines = [
                    `${ele.eventName} event of ${ele.subEvent}.`,
                    "Organized by the Department of Computer Science,",
                    `Held on ${ele.eventDate}.`,
                ];
                let y = 500;
                const maxWidth = 1026;
                lines.forEach((line) => {
                    doc.font("roboto").fontSize(28).fillColor("black");
                    const lineWidth = doc.widthOfString(line);
                    const x = 330 + (maxWidth - lineWidth) / 2;
                    doc.text(line, x, y);
                    y += 35;
                });


                const stream = fs.createWriteStream(filePath);
                doc.pipe(stream);
                doc.end();
                stream.on("finish", async () => {
                    const transporter = nodemailer.createTransport({
                        host: 'smtp.gmail.com',
                        port: 587,
                        secure: false,
                        auth: {
                            user: process.env.EMAIL,
                            pass: process.env.PASS,
                        },
                    });
                    const mailOptions = {
                        from: process.env.EMAIL,
                        to: `${ele.mail}`,
                        subject: `Congratulations! Here's Your ${ele.eventName} Certificate`,
                        text: `Dear ${ele.name},\n\nThank you for participating in the ${ele.eventName} event. We're pleased to share your certificate of participation.\n\nBest regards,\nEvent Team`,
                        attachments: [{ filename: fileName, path: filePath }],
                    };
                    await transporter.sendMail(mailOptions)
                    resolve({ name: ele.name, filePath });
                });
                stream.on("error", reject);
            });
        });
        const result = await Promise.all(certificatePromises);
        res.status(200).json({ message: "Certificates generated and sent successfully", result });
    } catch (error) {
        console.error(`Error in certificateGenerator: ${error}`);
        res.status(500).json({ error: "Internal server error." });
    }
};
