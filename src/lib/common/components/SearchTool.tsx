import Link from 'next/link';
import { Toolbar } from '@mui/material';
import AddFab from './AddFab';

type SearchToolProps = {
  addBtnLink: string;
}

export default function SearchTool(toolsProps: SearchToolProps) {
  return (
    <Toolbar
      sx={{
        display: 'flex',
        justifyContent: 'end',
        alignItems: 'end',
        gap: 4,
      }}
    >
      <Link href={toolsProps.addBtnLink}>
        <AddFab  />
      </Link>
    </Toolbar>
  );
}
