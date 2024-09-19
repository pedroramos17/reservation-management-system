import styled from "@emotion/styled";

export const Title = styled("h1")({
	color: "#444746",
});

export const Container = styled.div`
	display: flex;
	flex-direction: column;
	align-items: start;
	overflow: auto;
	padding: 0 20px;
	height: 100vh;
`;
export const HeaderContainer = styled.div`
	display: flex;
	justify-content: space-between;
	align-items: end;
	padding: 0 4px;
	width: 100%;
	margin-bottom: 24px;
`;

export const ContainerCentered = styled.div`
	height: 100vh;
	display: flex;
	flex-direction: column;
	justify-content: center;
	align-items: center;
`;

export const Image = styled.img`
	width: 124px;
	margin-bottom: 24px;
	display: block;
`;

export const Wrapper = styled.div`
	display: flex;
	flex-direction: column;
	justify-content: center;
	align-items: center;
	margin-top: 28px;
`;
