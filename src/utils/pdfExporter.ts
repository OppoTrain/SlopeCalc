import { Filesystem, Directory } from "@capacitor/filesystem";
import { PDFDocument, rgb } from "pdf-lib";
import type { ProjectFormData } from "../types/project";

// Converts Uint8Array to base64
function uint8ToBase64(bytes: Uint8Array): string {
    let binary = "";
    for (let i = 0; i < bytes.byteLength; i++) {
        binary += String.fromCharCode(bytes[i]);
    }
    return btoa(binary);
}

// Ensures storage permission is granted
const checkStoragePermission = async () => {
    let permStatus = await Filesystem.checkPermissions();
    if (permStatus.publicStorage !== "granted") {
        permStatus = await Filesystem.requestPermissions();
        if (permStatus.publicStorage !== "granted") {
            throw new Error("Storage permission not granted");
        }
    }
};

// Generates a PDF from project data
export async function generatePdf(
    project: ProjectFormData
): Promise<Uint8Array | null> {
    try {
        const pdfDoc = await PDFDocument.create();
        let page = pdfDoc.addPage([600, 800]);
        const { height } = page.getSize();

        const fontSize = 12;
        const lineHeight = 18;
        let y = height - 50;
        const marginX = 50;

        const drawText = (
            text: string,
            x: number,
            yPos: number,
            size = fontSize,
            color = rgb(0, 0, 0)
        ) => {
            page.drawText(text, { x, y: yPos, size, color });
        };

        const addHeader = (title: string) => {
            y -= 30;
            drawText(title, marginX, y, 16, rgb(0, 0.3, 0.7));
            y -= lineHeight;
        };

        const checkPageSpace = (spaceNeeded = 40) => {
            if (y < spaceNeeded) {
                page = pdfDoc.addPage([600, 800]);
                y = page.getHeight() - 50;
            }
        };

        // Project Details
        addHeader("Project Details");
        const details = [
            ["Project Name", project.projectDetails.projectName],
            ["Contractor", project.projectDetails.contractorName],
            ["Inspector", project.projectDetails.inspectorName],
            ["Date", project.projectDetails.date],
            ["Location", project.projectDetails.location],
            ["Slope", project.projectDetails.slope || "-"],
        ];

        details.forEach(([label, value]) => {
            checkPageSpace();
            drawText(`${label}:`, marginX, y);
            drawText(value || "-", marginX + 150, y);
            y -= lineHeight;
        });

        // Connectors Table
        if (project.connectors && project.connectors.length > 0) {
            addHeader("Connectors");

            const headers = [
                "Joint #",
                "Distance",
                "Elevation Drop",
                "Theoretical",
                "Actual",
                "Difference",
            ];
            const colWidth = 80;
            const headerColor = rgb(0, 0.53, 0.71);
            checkPageSpace(60);

            headers.forEach((text, i) =>
                drawText(text, marginX + i * colWidth, y, 10, headerColor)
            );
            y -= lineHeight;

            project.connectors.forEach((c) => {
                checkPageSpace(30);
                const values = [
                    c.jointNumber ?? "-",
                    c.distance ?? "-",
                    c.elevationDrop ?? "-",
                    c.theoreticalElevation ?? "-",
                    c.actualElevation ?? "-",
                    c.difference ?? "-",
                ];
                values.forEach((val, i) =>
                    drawText(val.toString(), marginX + i * colWidth, y, 10)
                );
                y -= lineHeight - 4;
            });
        }

        // Photo Embeds
        if (
            Array.isArray(project.projectDetails.photoUri) &&
            project.projectDetails.photoUri.length > 0
        ) {
            addHeader("Photos");

            for (const uri of project.projectDetails.photoUri) {
                try {
                    let imgData = uri;

                    if (!uri.startsWith("data:")) {
                        if (uri.startsWith("file://")) {
                            const fileReadResult = await Filesystem.readFile({
                                path: uri,
                            });
                            imgData = `data:image/jpeg;base64,${fileReadResult.data}`;
                        } else {
                            const res = await fetch(uri);
                            const blob = await res.blob();
                            imgData = await new Promise<string>(
                                (resolve, reject) => {
                                    const reader = new FileReader();
                                    reader.onloadend = () =>
                                        resolve(reader.result as string);
                                    reader.onerror = reject;
                                    reader.readAsDataURL(blob);
                                }
                            );
                        }
                    }

                    const base64 = imgData.split(",")[1];
                    const imageBytes = Uint8Array.from(atob(base64), (c) =>
                        c.charCodeAt(0)
                    );

                    let image;
                    if (imgData.startsWith("data:image/png")) {
                        image = await pdfDoc.embedPng(imageBytes);
                    } else {
                        image = await pdfDoc.embedJpg(imageBytes);
                    }

                    const { width, height } = image.scale(1);
                    const scale = Math.min(300 / width, 225 / height);
                    const scaled = image.scale(scale);

                    checkPageSpace(scaled.height + 20);
                    page.drawImage(image, {
                        x: marginX,
                        y: y - scaled.height,
                        width: scaled.width,
                        height: scaled.height,
                    });

                    y -= scaled.height + 20;
                } catch (err) {
                    console.warn("Failed to load image:", err);
                    drawText("Image could not be loaded", marginX, y);
                    y -= lineHeight;
                }
            }
        }
        const pdfBytes = await pdfDoc.save();
        return pdfBytes;
    } catch (error) {
        console.error("PDF generation failed:", error);
        return null;
    }
}

// Saves a PDF to the filesystem
export async function savePdfToFile(
    pdfBytes: Uint8Array,
    fileName: string
): Promise<string | null> {
    try {
        const base64Pdf = uint8ToBase64(pdfBytes);
        const filePath = `${fileName}.pdf`;

        await Filesystem.writeFile({
            path: filePath,
            data: base64Pdf,
            directory: Directory.Documents,
        });
        console.log("PDF saved to:", filePath);
        return filePath;
    } catch (error) {
        console.error("Failed to save PDF:", error);
        return null;
    }
}

// Main entry point
export const processPDF = async (data: ProjectFormData) => {
    try {
        await checkStoragePermission();
        const file = await generatePdf(data);
        if (file) {
            const path = await savePdfToFile(
                file,
                data.projectDetails.projectName || "project"
            );
            if (path) {
                alert(`PDF saved successfully: ${path}`);
            }
        }
    } catch (error) {
        alert("Error generating PDF: " + (error as Error).message);
    }
};
