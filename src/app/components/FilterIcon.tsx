import { IconButton, Tooltip } from '@mui/material';
import FilterAltIcon from '@mui/icons-material/FilterAlt';

export default function FilterIcon() {
  return (
    <Tooltip title="Filtrar">
      <IconButton>
        <FilterAltIcon sx={{ fontSize: 36 }} />
      </IconButton>
    </Tooltip>
  );
}
