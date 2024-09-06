import styled from "@emotion/styled";

const Container = styled.div`
	display: flex;
	flex-direction: column;
	justify-content: space-between;
	align-items: stretch;
	width: 70%;
	height: 100%;
	padding: 24px auto;
	gap: 12px;

	@media (max-width: 768px) {
		width: 100%;
	}
`;

const ButtonContainer = styled.div`
	display: flex;
	justify-content: flex-end;
`;

const FlexContainer = styled.div`
	display: flex;
	flex-direction: column;
	@media (min-width: 640px) {
		flex-direction: row;
		gap: 48px;
		width: 100%;
	}
`;

const GridContainer = styled.div`
	display: grid;
	grid-template-columns: repeat(3, 1fr);
	gap: 24px;

	@media (max-width: 768px) {
		grid-template-columns: repeat(2, 1fr);
	}

	@media (max-width: 600px) {
		grid-template-columns: repeat(1, 1fr);
	}
`;

export { Container, ButtonContainer, FlexContainer, GridContainer };
