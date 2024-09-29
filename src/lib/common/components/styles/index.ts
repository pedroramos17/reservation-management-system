import { styled } from "@mui/material/styles";

export const Title = styled("h1")({
	color: "text.primary",
});

export const Container = styled("div")({
	display: "flex",
	flexDirection: "column",
	alignItems: "start",
	padding: "0 20px",
	height: "100vh",
});
export const HeaderContainer = styled("div")({
	display: "flex",
	justifyContent: "space-between",
	alignItems: "end",
	padding: "0 4px",
	width: "100%",
	marginBottom: "24px",
});

export const ContainerCentered = styled("div")({
	height: "100vh",
	display: "flex",
	flexDirection: "column",
	justifyContent: "center",
	alignItems: "center",
});

export const Image = styled("div")({
	width: "124px",
	marginBottom: "24px",
	display: "block",
});

export const Wrapper = styled("div")({
	display: "flex",
	flexDirection: "column",
	justifyContent: "center",
	alignItems: "center",
	marginTop: "28px",
});
