import { Table, TableBody, TableHeader, TableHeaderCell } from '@vtex/shoreline';
import { useTranslation } from 'react-i18next';
import { RecentActivityItem } from './RecentActivityItem';
import { TABLE_COLUMN_WIDTHS, type SupervisorConversation } from './constants';

interface RecentActivityTableProps {
  conversations: SupervisorConversation[];
}

export function RecentActivityTable({ conversations }: RecentActivityTableProps) {
  const { t } = useTranslation();

  return (
    <Table columnWidths={TABLE_COLUMN_WIDTHS}>
      <TableHeader>
        <TableHeaderCell>{t('recent_activity.table.name')}</TableHeaderCell>
        <TableHeaderCell>{t('recent_activity.table.classification')}</TableHeaderCell>
        <TableHeaderCell>{t('recent_activity.table.csat')}</TableHeaderCell>
        <TableHeaderCell>{t('recent_activity.table.date')}</TableHeaderCell>
        <TableHeaderCell>{t('recent_activity.table.hour')}</TableHeaderCell>
      </TableHeader>

      <TableBody>
        {conversations.map((conversation) => (
          <RecentActivityItem key={conversation.uuid} conversation={conversation} />
        ))}
      </TableBody>
    </Table>
  );
}
