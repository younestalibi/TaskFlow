export default function LabelErrors({ errors = [], ...props }) {
    return (
        <>
            {errors?.length > 0 && (
                <div {...props} >
                    <ul className="mt-3 list-disc list-inside text-sm text-red-600">
                        {errors?.map(error => (
                            <li key={error}>{error}</li>
                        ))}
                    </ul>
                </div>
            )}
        </>
    )
}