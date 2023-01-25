import FileSaver from "file-saver";
import { surpriseMePrompts } from "../constants";

export function getRandomPrompt() {
  const randomIndex = Math.floor(Math.random() * surpriseMePrompts.length);
  const randomPrompt = surpriseMePrompts[randomIndex];
  return randomPrompt;
}

export async function downloadImage(image) {
  FileSaver.saveAs(image, "untitled.jpg");
}
