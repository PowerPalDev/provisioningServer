import 'bootstrap/dist/css/bootstrap.min.css';
import 'bootstrap-icons/font/bootstrap-icons.css';
import { useSignUpForm } from '../../hooks/useSignUp';

interface AddUserDialogProps {
    open: boolean;
    handleClose: () => void;
}

export const AddUserDialog: React.FC<AddUserDialogProps> = ({ open, handleClose }) => {
    const {
        emailError,
        emailErrorMessage,
        passwordError,
        passwordErrorMessage,
        showPassword,
        setShowPassword,
        handleSignUp,
    } = useSignUpForm();

    const handleClickShowPassword = () => setShowPassword(!showPassword);

    const handleFormSubmit = (e: React.FormEvent<HTMLFormElement>) => {
        e.preventDefault();
        const data = new FormData(e.currentTarget);
        handleSignUp(data.get('email') as string, data.get('password') as string, handleClose);
    };

    return open ? (
        <div className="modal show d-block" tabIndex={-1} role="dialog">
            <div className="modal-dialog modal-dialog-centered" role="document">
                <div className="modal-content shadow-sm">
                    <div className="modal-header">
                        <h5 className="modal-title">Add New User</h5>
                        <button
                            type="button"
                            className="btn-close"
                            aria-label="Close"
                            onClick={handleClose}
                        ></button>
                    </div>
                    <div className="modal-body">
                        <form onSubmit={handleFormSubmit}>
                            <div className="mb-3">
                                <label htmlFor="email" className="form-label">
                                    Email
                                </label>
                                <input
                                    type="email"
                                    className={`form-control ${emailError ? 'is-invalid' : ''}`}
                                    id="email"
                                    name="email"
                                    placeholder="your@email.com"
                                    required
                                    autoComplete="email"
                                />
                                {emailError && (
                                    <div className="invalid-feedback">{emailErrorMessage}</div>
                                )}
                            </div>

                            <div className="mb-3">
                                <label htmlFor="password" className="form-label">
                                    Password
                                </label>
                                <div className="input-group">
                                    <input
                                        type={showPassword ? 'text' : 'password'}
                                        className={`form-control ${
                                            passwordError ? 'is-invalid' : ''
                                        }`}
                                        id="password"
                                        name="password"
                                        placeholder="••••••"
                                        required
                                        autoComplete="new-password"
                                    />
                                    <button
                                        type="button"
                                        className="btn btn-outline-secondary"
                                        onClick={handleClickShowPassword}
                                    >
                                        <i
                                            className={`bi ${
                                                showPassword ? 'bi-eye-slash' : 'bi-eye'
                                            }`}
                                        ></i>
                                    </button>
                                    {passwordError && (
                                        <div className="invalid-feedback">
                                            {passwordErrorMessage}
                                        </div>
                                    )}
                                </div>
                            </div>

                            <div className="d-flex justify-content-end">
                                <button type="submit" className="btn btn-primary">
                                    Add
                                </button>
                            </div>
                        </form>
                    </div>
                </div>
            </div>
        </div>
    ) : null;
};
