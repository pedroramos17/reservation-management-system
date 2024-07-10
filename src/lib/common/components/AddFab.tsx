import { Fab, Tooltip } from '@mui/material';
import AddIcon from '@mui/icons-material/Add';

export default function AddFab() {
  return (
    <Tooltip title="Adicionar">
      <Fab color="primary" size="large">
        <AddIcon sx={{ fontSize: 48 }} />
      </Fab>
    </Tooltip>
  );
}
