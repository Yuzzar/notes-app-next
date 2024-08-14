import { useState } from 'react';
import { Box, Heading, Input, Textarea, Button, Flex } from '@chakra-ui/react';
import { useRouter } from 'next/router';
import graphQLClient from '../../lib/graphql-client';
import gql from 'graphql-tag';

const ADD_NOTE = gql`
  mutation AddNote($title: String!, $body: String!) {
    addNote(title: $title, body: $body) {
      id
    }
  }
`;

export default function AddNote() {
  const router = useRouter();
  const [title, setTitle] = useState('');
  const [body, setBody] = useState('');

  const addNote = async () => {
    await graphQLClient.request(ADD_NOTE, { title, body });
    router.push('/');
  };

  return (
    <Box p={5}>
      <Heading mb={6}>Tambah Catatan Baru</Heading>
      <Input
        placeholder="Judul"
        value={title}
        onChange={(e) => setTitle(e.target.value)}
        mb={4}
      />
      <Textarea
        placeholder="Isi catatan"
        value={body}
        onChange={(e) => setBody(e.target.value)}
        mb={4}
      />
      <Flex justifyContent="flex-start">
        <Button colorScheme="teal" onClick={addNote} mr={4}>
          Tambah Catatan
        </Button>
        <Button colorScheme="gray" onClick={() => router.push('/')}>
          Kembali ke Catatan
        </Button>
      </Flex>
    </Box>
  );
}
