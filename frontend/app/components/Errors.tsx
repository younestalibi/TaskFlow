export default function LabelErrors({ errors = [], ...props }) {
    const formatErrors = () => {
        if (Array.isArray(errors)) {
            return errors;
        } else if (typeof errors === "object" && errors !== null) {
            // Flatten errors if they are in an object format
            return Object.values(errors).flat();
        }
        return [];
    };

    const formattedErrors = formatErrors();

    return (
        <>
            {formattedErrors.length > 0 && (
                <div {...props}>
                    <ul className="mt-3 list-disc list-inside text-sm text-red-600">
                        {formattedErrors.map((error, index) => (
                            <li key={index}>{error}</li>
                        ))}
                    </ul>
                </div>
            )}
        </>
    );
}
