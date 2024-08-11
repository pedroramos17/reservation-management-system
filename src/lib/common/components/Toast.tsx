import Button from '@mui/material/Button';
import { SnackbarProvider, VariantType, useSnackbar } from 'notistack';

interface ToastProps {
    toastMessage: string;
    buttonMessage?: string;
    variant?: VariantType;
    maxSnack?: number;
}
export default function Toast(props: ToastProps) {
    /**
     * Props for the Toast component.
     *
     * @property {string} toastMessage - The text to display in the toast notification.
     * @property {string} buttonMessage - The text to display on the button.
     * @property {VariantType} [variant] - The variant of the toast notification (success, error, warning, info, or default).
     * @property {number} [maxSnack] - The maximum number of toast notifications to display at once.
     */
    const { buttonMessage, toastMessage, variant, maxSnack } = props;
    const { enqueueSnackbar } = useSnackbar();

    const handleClickVariant = () => () => {
        // variant could be success, error, warning, info, or default
        enqueueSnackbar(toastMessage, { variant });
    };

    return (
        <SnackbarProvider maxSnack={maxSnack ?? 3}>
            { buttonMessage ? <Button onClick={handleClickVariant}>{buttonMessage}</Button> :  enqueueSnackbar(toastMessage, { variant }) }

        </SnackbarProvider>
    )
}