interface DecorativeBoxProps {
    height: string;
    color: string;
}

export const DecorativeBox = ({ height, color }: DecorativeBoxProps) => (
    <div style={{ 
        height, 
        backgroundColor: color,
        borderRadius: '8px'
    }} />
); 