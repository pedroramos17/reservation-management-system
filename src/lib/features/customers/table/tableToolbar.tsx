import { Toolbar, Tooltip, IconButton, Typography } from '@mui/material';
import { alpha } from '@mui/material/styles';
import DeleteIcon from '@mui/icons-material/Delete';

interface CustomerTableToolBarProps {
  numSelected: number;
  onDeleteSelectedCustomers: () => Promise<void>;
}

export default function CustomerTableToolbar(
  props: Readonly<CustomerTableToolBarProps>,
) {
  const { numSelected, onDeleteSelectedCustomers } = props;

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
        <Typography
          sx={{ flex: '1 1 100%' }}
          variant="h6"
          id="tableTitle"
          component="div"
        >
          Lista de motoristas
        </Typography>
      )}
      {numSelected > 0 && (
      <Tooltip title="Excluir" onClick={onDeleteSelectedCustomers}>
          <IconButton>
            <DeleteIcon />
          </IconButton>
        </Tooltip>
      )}
    </Toolbar>
  );
}
