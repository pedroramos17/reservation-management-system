import { Toolbar, Tooltip, IconButton, Typography, Box } from '@mui/material';
import { alpha } from '@mui/material/styles';
import Link from 'next/link';

interface GatewayTableToolBarProps {
  numSelected: number;
}

export default function GatewayTableToolbar(
  props: Readonly<GatewayTableToolBarProps>,
) {
  const { numSelected } = props;

  return (
    <Toolbar
      sx={{
        pl: { sm: 2 },
        pr: { xs: 1, sm: 1 },
        ...(numSelected > 0 && {
          bgcolor: (theme) =>
            alpha(
              theme.palette.primary.main,
              theme.palette.action.activatedOpacity,
            ),
        }),
      }}
    >
      {numSelected > 0 ? (
        <Typography
          sx={{ flex: '1 1 100%' }}
          color="inherit"
          variant="subtitle1"
          component="div"
        >
          {numSelected} {numSelected > 1 ? 'selecionados' : 'selecionado'}
        </Typography>
      ) : (
        <Box sx={{ display: 'flex', alignItems: 'center', flexGrow: 1 }}>
          <Typography
            sx={{ flex: '1 1 100%' }}
            variant="h6"
            id="tableTitle"
            component="div"
          >
            Movimentação
          </Typography>
          <Link href={'/portaria/historico'} >Histórico de movimentações</Link>
        </Box>
      )}
    </Toolbar>
  );
}
