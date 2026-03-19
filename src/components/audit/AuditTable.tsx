import { Table, TableBody, TableHeader, TableHeaderCell } from '@vtex/shoreline';
import { useTranslation } from 'react-i18next';
import { AuditItem } from './AuditItem';
import { TABLE_COLUMN_WIDTHS, type SupervisorConversation } from './constants';

interface AuditTableProps {
  conversations: SupervisorConversation[];
}

export function AuditTable({ conversations }: AuditTableProps) {
  const { t } = useTranslation();

  return (
    <Table columnWidths={TABLE_COLUMN_WIDTHS}>
      <TableHeader>
        <TableHeaderCell>{t('audit.table.name')}</TableHeaderCell>
        <TableHeaderCell>{t('audit.table.classification')}</TableHeaderCell>
        <TableHeaderCell>{t('audit.table.csat')}</TableHeaderCell>
        <TableHeaderCell>{t('audit.table.date')}</TableHeaderCell>
        <TableHeaderCell>{t('audit.table.hour')}</TableHeaderCell>
      </TableHeader>

      <TableBody>
        {conversations.map((conversation) => (
          <AuditItem key={conversation.uuid} conversation={conversation} />
        ))}
      </TableBody>
    </Table>
  );
}
