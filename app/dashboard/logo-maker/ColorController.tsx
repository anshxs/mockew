import React from 'react'
import ColorPicker from 'react-best-gradient-color-picker'

interface ColorControllerProps {
    setSelectedColor: (color: string) => void;
    selectedColor?: string;
    hideController: boolean;
}

function ColorController({ setSelectedColor, selectedColor, hideController=true}: ColorControllerProps): React.ReactElement {
    const [color, setColor] = React.useState<string>(selectedColor ?? 'rgba(255,255,255,1)');
    React.useEffect(() => {
        if (selectedColor !== undefined) {
            setColor(selectedColor);
        }
    }, [selectedColor]);
    return (
        <div>
            <ColorPicker
                hideControls={hideController}
                hideEyeDrop
                hideAdvancedSliders
                hideColorGuide
                hideInputType
                value={color}
                onChange={(e: string) => {
                    setColor(e);
                    setSelectedColor(e);
                }}
            />
        </div>
    );
}

export default ColorController