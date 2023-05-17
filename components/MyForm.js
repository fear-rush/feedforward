import { useState, useEffect } from 'react';
import { useForm } from 'react-hook-form';

const MyForm = () => {
  const { register, handleSubmit, formState } = useForm();
  const [isAutoFilled, setIsAutoFilled] = useState(false);

  useEffect(() => {
    const hasValue = Object.values(formState.dirtyFields).some(Boolean);
    if (hasValue && !formState.isValid) {
      setIsAutoFilled(true);
    }
  }, [formState.dirtyFields, formState.isValid]);

  const onSubmit = (data) => {
    console.log(data);
  };

  return (
    <form onSubmit={handleSubmit(onSubmit)}>
      <input
        type="text"
        name="example"
        defaultValue=""
        {...register("example", {
          required: "Please enter a valid pickup address",
        })}
        onChange={() => setIsAutoFilled(false)}
      />
      {isAutoFilled && <p>This field was auto-filled.</p>}
      <button type="submit">Submit</button>
    </form>
  );
}

export default MyForm;

