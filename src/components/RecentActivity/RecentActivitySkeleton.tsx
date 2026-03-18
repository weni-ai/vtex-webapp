import {
  Flex,
  Skeleton,
  Table,
  TableBody,
  TableCell,
  TableHeader,
  TableHeaderCell,
  TableRow,
} from '@vtex/shoreline';
import { TABLE_COLUMN_WIDTHS } from './constants';

const SKELETON_ROW_COUNT = 5;

function SkeletonRow() {
  return (
    <TableRow>
      <TableCell>
        <Flex direction="column" gap="$space-1">
          <Skeleton style={{ width: '120px', height: '20px' }} />
          <Skeleton style={{ width: '100px', height: '16px' }} />
        </Flex>
      </TableCell>

      <TableCell>
        <Skeleton style={{ width: '80px', height: '24px', borderRadius: '9999px' }} />
      </TableCell>

      <TableCell>
        <Skeleton style={{ width: '140px', height: '20px' }} />
      </TableCell>

      <TableCell>
        <Skeleton style={{ width: '80px', height: '20px' }} />
      </TableCell>

      <TableCell>
        <Skeleton style={{ width: '40px', height: '20px' }} />
      </TableCell>
    </TableRow>
  );
}

export function RecentActivitySkeleton() {
  return (
    <Table columnWidths={TABLE_COLUMN_WIDTHS}>
      <TableHeader>
        <TableHeaderCell>
          <Skeleton style={{ width: '40px', height: '16px' }} />
        </TableHeaderCell>
        <TableHeaderCell>
          <Skeleton style={{ width: '90px', height: '16px' }} />
        </TableHeaderCell>
        <TableHeaderCell>
          <Skeleton style={{ width: '35px', height: '16px' }} />
        </TableHeaderCell>
        <TableHeaderCell>
          <Skeleton style={{ width: '30px', height: '16px' }} />
        </TableHeaderCell>
        <TableHeaderCell>
          <Skeleton style={{ width: '30px', height: '16px' }} />
        </TableHeaderCell>
      </TableHeader>

      <TableBody>
        {Array.from({ length: SKELETON_ROW_COUNT }).map((_, index) => (
          <SkeletonRow key={index} />
        ))}
      </TableBody>
    </Table>
  );
}
