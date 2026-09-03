import { PDFParse } from 'pdf-parse';

export const extractTextFromPdf = async (path) => {
  	const parser = new PDFParse({ url: path });

	const result = await parser.getText();
	console.log(result.text);

  return result.text
}

export const extractDescription = (text) => {
	const match = text.match(
		/(?:summary|professional summary|profile|objective|about me)\s*:?\s*([\s\S]*?)(?=\n(?:education|experience|skills|projects|work experience|employment)\b)/i
	)

	return match?.[1]?.trim() || 'description autogeneration failed, please edit manually'
}