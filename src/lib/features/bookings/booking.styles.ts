import { styled } from "@mui/material";

const Listbox = styled("ul")(({ theme }) => ({
	width: 200,
	margin: 0,
	padding: 0,
	zIndex: 1,
	position: "absolute",
	listStyle: "none",
	backgroundColor: "#fff",
	overflow: "auto",
	maxHeight: 200,
	border: "1px solid rgba(0,0,0,.25)",
	"& li.Mui-focused": {
		backgroundColor: "#4a8df6",
		color: "white",
		cursor: "pointer",
	},
	"& li:active": {
		backgroundColor: "#2977f5",
		color: "white",
	},
	...theme.applyStyles("dark", {
		backgroundColor: "#000",
	}),
}));

export { Listbox };
