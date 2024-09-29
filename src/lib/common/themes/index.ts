"use client";

import { createTheme } from "@mui/material";

const theme = createTheme({
	colorSchemes: {
		dark: {
			palette: {
				background: {
					default: "#141314",
				},
			},
		},
		light: {
			palette: {
				background: {
					default: "#F9F9FA",
				},
			},
		},
	},
});

export default theme;
