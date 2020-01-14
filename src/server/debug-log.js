export default function debugLog(str) {
	if (process.env.NODE_ENV !== 'production') {
		console.log(str);
	}
}
