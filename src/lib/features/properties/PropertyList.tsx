'use client';

import ResponsiveTable from "@/lib/common/components/ResponsiveTable";
import Search from "@/lib/common/components/Search";
import SearchTool from "@/lib/common/components/SearchTool";
import { Container, HeaderContainer, Title } from "@/lib/common/components/styles";

export default function PropertyList() {
const cols = [
    {
        id: 'checkButton',
        label: '',
        isSorted: false,
        isResizable: false,
        width: 20,    
    },
    {
        id: 'nameId',
        label: 'Nome',
        isSorted: true,
        isResizable: true,
        width: 300,    
    },
    {
        id: 'dateId',
        label: 'Data de criação',
        isSorted: true,
        isResizable: true,
        width: 20,    
    },
    {
        id: 'checkInCountId',
        label: 'Check-in Total',
        isSorted: true,
        isResizable: true,
        width: 20,    
    },
    {
        id: 'optionsId',
        label: 'Opções',
        isSorted: true,
        isResizable: true,
        width: 20,    
    },
    {
        id: 'shareButton',
        label: 'Compartilhar',
        isSorted: false,
        isResizable: false,
        width: 20,
    },
];
return (
    <Container>
        <Title>Propriedades</Title>
        <HeaderContainer>
            <Search placeholder="Pesquisar" variant="standard" />
            <SearchTool addBtnLink="/propriedades/criar" />
        </HeaderContainer>
            <ResponsiveTable columns={cols} data={[]} toolbarTitle='Lista de propriedades' storageKey='properties' />
    </Container>
);
}