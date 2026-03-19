import { Flex, Grid, Skeleton } from '@vtex/shoreline';
import type { ReactNode } from 'react';

interface MetricGridBaseProps<T> {
  renderItem: (item: T, index: number) => ReactNode;
  isLoading?: boolean;
  loadingHeight?: string;
}

interface MetricGridFlatProps<T> extends MetricGridBaseProps<T> {
  items: T[];
  columns?: number;
  rows?: never;
}

interface MetricGridPreChunkedProps<T> extends MetricGridBaseProps<T> {
  rows: T[][];
  items?: never;
  columns?: never;
}

export type MetricGridProps<T> =
  | MetricGridFlatProps<T>
  | MetricGridPreChunkedProps<T>;

function chunkArray<T>(array: T[], size: number): T[][] {
  const chunks: T[][] = [];

  for (let i = 0; i < array.length; i += size) {
    chunks.push(array.slice(i, i + size));
  }

  return chunks;
}

function resolveRows<T>(props: MetricGridProps<T>): T[][] {
  if (props.rows) {
    return props.rows;
  }

  return chunkArray(props.items, props.columns ?? 4);
}

export function MetricGrid<T>(props: MetricGridProps<T>) {
  const {
    renderItem,
    isLoading = false,
    loadingHeight = '92px',
  } = props;

  if (isLoading) {
    return <Skeleton width="100%" height={loadingHeight} />;
  }

  const rows = resolveRows(props);

  if (rows.length === 0 || rows.every((row) => row.length === 0)) {
    return null;
  }

  return (
    <Flex
      direction="column"
      gap="$space-0"
      style={{
        border: 'var(--sl-border-base)',
        borderRadius: 'var(--sl-radius-2)',
      }}
    >
      {rows.map((row, rowIndex) => (
        <Grid
          key={`metric-grid-row-${rowIndex}`}
          columns={`repeat(${row.length}, 1fr)`}
          gap="$space-0"
          style={{
            borderBottom:
              rowIndex !== rows.length - 1
                ? 'var(--sl-border-base)'
                : undefined,
          }}
        >
          {row.map((item, itemIndex) => (
            <div
              key={`metric-grid-item-${rowIndex}-${itemIndex}`}
              style={{
                borderRight:
                  itemIndex !== row.length - 1
                    ? 'var(--sl-border-base)'
                    : undefined,
              }}
            >
              {renderItem(item, rowIndex * row.length + itemIndex)}
            </div>
          ))}
        </Grid>
      ))}
    </Flex>
  );
}
