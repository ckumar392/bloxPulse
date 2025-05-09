import React from 'react';
import { 
  TextField, 
  TextFieldProps as MuiTextFieldProps, 
  FormControl, 
  InputLabel, 
  Select, 
  MenuItem, 
  FormHelperText,
  FormControlLabel,
  Checkbox,
  Switch,
  FormGroup,
  Box,
  SelectProps as MuiSelectProps,
  InputBase,
  styled,
  alpha
} from '@mui/material';
import { colors } from '../theme/theme';

// Styled TextField with green focus indicator
const StyledTextField = styled(TextField)(({ theme }) => ({
  '& .MuiInputBase-root': {
    borderRadius: '8px',
    transition: 'box-shadow 0.3s ease',
    backgroundColor: alpha('#FFFFFF', 0.6),
  },
  '& .MuiInputBase-input::placeholder': {
    color: alpha(colors.mediumGray, 0.7),
    opacity: 1,
    fontWeight: 400,
  },
  '& .MuiOutlinedInput-root': {
    '&.Mui-focused fieldset': {
      borderColor: colors.accent1,
      borderWidth: '2px',
    },
    '&:hover fieldset': {
      borderColor: alpha(colors.accent1, 0.7),
    },
  },
  '& .MuiInputLabel-root': {
    '&.Mui-focused': {
      color: colors.accent1,
    },
  },
  '& .MuiFormHelperText-root': {
    marginLeft: '4px',
  },
}));

// Styled Select with green focus indicator
const StyledFormControl = styled(FormControl)(({ theme }) => ({
  '& .MuiOutlinedInput-root': {
    borderRadius: '8px',
    transition: 'box-shadow 0.3s ease',
    backgroundColor: alpha('#FFFFFF', 0.6),
    '&.Mui-focused .MuiOutlinedInput-notchedOutline': {
      borderColor: colors.accent1,
      borderWidth: '2px',
    },
    '&:hover .MuiOutlinedInput-notchedOutline': {
      borderColor: alpha(colors.accent1, 0.7),
    },
  },
  '& .MuiInputLabel-root': {
    '&.Mui-focused': {
      color: colors.accent1,
    },
  },
}));

// Styled Checkbox with green accent
const StyledCheckbox = styled(Checkbox)(({ theme }) => ({
  '&.Mui-checked': {
    color: colors.accent1,
  },
  padding: '4px',
  marginRight: '4px',
}));

// Styled Switch with green accent
const StyledSwitch = styled(Switch)(({ theme }) => ({
  '& .MuiSwitch-switchBase': {
    '&.Mui-checked': {
      color: colors.white,
      '& + .MuiSwitch-track': {
        backgroundColor: colors.accent1,
        opacity: 0.9,
      },
      '&.Mui-disabled + .MuiSwitch-track': {
        opacity: 0.5,
      },
    },
  },
}));

// Custom Search Input
const SearchInput = styled(InputBase)(({ theme }) => ({
  padding: '10px 16px',
  borderRadius: '24px',
  backgroundColor: alpha('#FFFFFF', 0.9),
  border: `1px solid ${alpha(colors.borderColor, 0.5)}`,
  width: '100%',
  '&:hover': {
    backgroundColor: alpha('#FFFFFF', 1),
    boxShadow: `0 2px 8px ${alpha(colors.primary, 0.08)}`,
  },
  '&.Mui-focused': {
    boxShadow: `0 0 0 2px ${alpha(colors.accent1, 0.25)}`,
  },
  '& .MuiInputBase-input': {
    padding: 0,
    '&::placeholder': {
      color: alpha(colors.mediumGray, 0.7),
      fontWeight: 400,
    },
  },
  transition: 'all 0.3s ease',
}));

// Form components with additional props/functionality
interface FormTextFieldProps extends Omit<MuiTextFieldProps, 'variant'> {
  helperText?: string;
}

interface FormSelectProps extends Omit<MuiSelectProps, 'variant'> {
  label?: string;
  helperText?: string;
  children: React.ReactNode;
  fullWidth?: boolean;
}

export const FormTextField: React.FC<FormTextFieldProps> = ({
  helperText,
  ...props
}) => {
  return (
    <StyledTextField
      variant="outlined"
      fullWidth
      {...props}
      helperText={helperText}
    />
  );
};

export const FormSelect: React.FC<FormSelectProps> = ({
  label,
  helperText,
  children,
  fullWidth = true,
  ...props
}) => {
  return (
    <StyledFormControl fullWidth={fullWidth} variant="outlined">
      {label && <InputLabel>{label}</InputLabel>}
      <Select label={label} {...props}>
        {children}
      </Select>
      {helperText && <FormHelperText>{helperText}</FormHelperText>}
    </StyledFormControl>
  );
};

interface FormControlLabelProps {
  label: string;
  checked?: boolean;
  onChange?: (event: React.ChangeEvent<HTMLInputElement>) => void;
  disabled?: boolean;
}

export const FormCheckbox: React.FC<FormControlLabelProps> = ({
  label,
  checked,
  onChange,
  ...props
}) => {
  return (
    <FormControlLabel
      control={<StyledCheckbox checked={checked} onChange={onChange} />}
      label={label}
      {...props}
    />
  );
};

export const FormSwitch: React.FC<FormControlLabelProps> = ({
  label,
  checked,
  onChange,
  ...props
}) => {
  return (
    <FormControlLabel
      control={<StyledSwitch checked={checked} onChange={onChange} />}
      label={label}
      {...props}
    />
  );
};

export const SearchBar: React.FC<{ 
  placeholder?: string;
  value?: string;
  onChange?: (event: React.ChangeEvent<HTMLInputElement>) => void;
}> = ({ placeholder = 'Search...', value, onChange }) => {
  return (
    <Box sx={{ position: 'relative', width: '100%' }}>
      <SearchInput
        placeholder={placeholder}
        value={value}
        onChange={onChange}
        fullWidth
      />
    </Box>
  );
};