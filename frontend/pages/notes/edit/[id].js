import { useRouter } from 'next/router';
import { useState, useEffect } from 'react';
import { Box, Heading, Input, Textarea, Button, Spinner, Alert, AlertIcon, Flex, useToast, Center } from '@chakra-ui/react';
import graphQLClient from '../../../lib/graphql-client';
import gql from 'graphql-tag';

const GET_NOTE = gql`
  query Note($id: ID!) {
    note(id: $id) {
      id
      title
      body
    }
  }
`;

const UPDATE_NOTE = gql`
  mutation UpdateNote($id: ID!, $title: String!, $body: String!) {
    updateNote(id: $id, title: $title, body: $body) {
      id
    }
  }
`;

export default function EditNote() {
  const router = useRouter();
  const { id } = router.query;
  const [title, setTitle] = useState('');
  const [body, setBody] = useState('');
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);
  const toast = useToast();

  useEffect(() => {
    if (id) {
      async function fetchNote() {
        try {
          const data = await graphQLClient.request(GET_NOTE, { id });
          setTitle(data.note.title);
          setBody(data.note.body);
          setLoading(false);
        } catch (error) {
          setError('Error fetching note data.');
          setLoading(false);
        }
      }

      fetchNote();
    }
  }, [id]);

  const updateNote = async () => {
    if (!title || !body) {
      setError('Title and body cannot be empty.');
      return;
    }

    try {
      await graphQLClient.request(UPDATE_NOTE, { id, title, body });
      toast({
        title: "Edit Berhasil",
        description: "Catatan telah diperbarui.",
        status: "success",
        duration: 3000,
        isClosable: true,
      });
      router.push(`/notes/${id}`);
    } catch (error) {
      setError('Error updating the note.');
    }
  };

  if (loading) {
    return (
      <Center h="100vh" bg="gray.100">
        <Spinner size="xl" />
      </Center>
    );
  }

  return (
    <Center h="100vh" bg="gray.700">
      <Box
        p={6}
        maxW="md"
        width="100%"
        bg="white"
        borderRadius="md"
        boxShadow="lg"
      >
        <Heading mb={6} textAlign="center" size="lg">
          Edit Catatan
        </Heading>
        {error && (
          <Alert status="error" mb={4}>
            <AlertIcon />
            {error}
          </Alert>
        )}
        <Input
          placeholder="Judul"
          value={title}
          onChange={(e) => setTitle(e.target.value)}
          mb={4}
          isRequired
        />
        <Textarea
          placeholder="Isi catatan"
          value={body}
          onChange={(e) => setBody(e.target.value)}
          mb={4}
          isRequired
        />
        <Flex mt={4} gap={4} justify="center">
          <Button colorScheme="teal" onClick={updateNote}>
            Simpan Perubahan
          </Button>
          <Button onClick={() => router.push(`/notes/${id}`)} colorScheme="gray">
            Kembali ke Detail Catatan
          </Button>
        </Flex>
      </Box>
    </Center>
  );
}
