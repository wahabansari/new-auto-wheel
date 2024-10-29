import { useState } from "react";
import { useForm } from "@mantine/form";
import {
  Modal,
  Button,
  TextInput,
  PasswordInput,
  Text,
  Title,
  Group,
  rem,
} from "@mantine/core";
import classes from "@/styles/Demo.module.scss";
import { useFormSubmission } from "@/custom-hooks/useForm";
import { API_ENDPOINTS } from "@/constants/api-endpoints";
import { signIn } from "next-auth/react";
import { BsCaretLeft, BsChevronLeft } from "react-icons/bs";
import { IconChevronCompactLeft } from "@tabler/icons-react";
import { FaChevronLeft } from "react-icons/fa6";

function SignIn({ signOpen, signInClose }) {
  // Initialize form with validation rules
  const form = useForm({
    initialValues: {
      email: "",
      password: "",
    },

    validate: {
      email: (value) =>
        /^\S+@\S+$/.test(value) ? null : "Please enter a valid email",
      password: (value) =>
        value.length >= 6 ? null : "Password must be at least 6 characters",
    },
  });

  const { isLoading, error, handleSubmit, data } = useFormSubmission(
    API_ENDPOINTS.AUTH.LOGIN, // Replace with your login endpoint
    form.values,
    form.validate
  );

  const handleSubmitSignIn = async () => {
    const result = await signIn("credentials", {
      redirect: false,
      password: form.values.password,
      email: form.values.email,
      type: "signIn",
      action: "Credentials",
    });
    result.ok && signInClose();
  };

  return (
    <>
      <Modal
        opened={signOpen}
        onClose={signInClose}
        withCloseButton={false}
        padding={rem(50)}
        size={rem(527)}
        centered
      >
        <Group mb="lg">
          <FaChevronLeft />
          <Title order={4}>Let’s get you started!</Title>
        </Group>

        {/* Form Starts */}
        <form>
          <TextInput
            label="Email"
            placeholder="Enter email"
            className="my-3"
            classNames={classes}
            {...form.getInputProps("email")}
            error={form.errors.email} // Display email error if validation fails
          />
          <PasswordInput
            label="Password"
            placeholder="Enter password"
            {...form.getInputProps("password")}
            error={form.errors.password} // Display password error if validation fails
          />
          <Text
            ta="right"
            c="dimmed"
            size="sm"
            mt="xs"
            className="cursor text-primary"
          >
            Forgot Password?
          </Text>
          <Button
            tt="uppercase"
            fw={600}
            size="md"
            fullWidth
            color="#E90808"
            autoContrast
            my="md"
            mt="xl"
            ff="heading"
            loading={isLoading} // Disable button while loading
            onClick={handleSubmitSignIn}
          >
            Sign In
          </Button>
          {error && <Text color="red">{error.message}</Text>}{" "}
          {/* Display API error */}
          <Text ta="center">
            Don't have an account?{" "}
            <Text span inherit className="text-primary" fw={600}>
              Sign up
            </Text>
          </Text>
        </form>
        {/* Form Ends */}
      </Modal>
    </>
  );
}

export default SignIn;
