import { useState, useEffect } from 'react';
import { Box, Heading, Text, Button, SimpleGrid, Center } from '@chakra-ui/react';
import Link from 'next/link';
import graphQLClient from '../lib/graphql-client';
import gql from 'graphql-tag';

const GET_NOTES = gql`
  query {
    notes {
      id
      title
      createdAt
      body
    }
  }
`;

export default function Home() {
  const [notes, setNotes] = useState([]);

  useEffect(() => {
    async function fetchNotes() {
      const data = await graphQLClient.request(GET_NOTES);
      setNotes(data.notes);
    }

    fetchNotes();
  }, []);

  return (
    <Center bg="blue.900" minH="100vh" p={5}>
      <Box p={5} maxWidth="800px" width="100%" bg="white" borderRadius="md" boxShadow="md">
        <Heading mb={6} textAlign="center" color="white" bg="blue.800" p={3} borderRadius="md">
          Catatan
        </Heading>
        {notes.length === 0 ? (
          <Text textAlign="center">Tidak ada catatan</Text>
        ) : (
          <SimpleGrid columns={[1, 2]} spacing={4}>
            {notes.map((note) => {
              let formattedDate;
              try {
                formattedDate = new Date(note.createdAt).toLocaleString();
              } catch (e) {
                formattedDate = 'Invalid Date';
              }

              return (
                <Box 
                  key={note.id} 
                  p={5} 
                  shadow="md" 
                  borderWidth="1px" 
                  borderRadius="md"
                >
                  <Link href={`/notes/${note.id}`}>
                    <Heading size="md" as="a">{note.title}</Heading>
                  </Link>
                  <Text fontSize="sm" color="gray.500">{formattedDate}</Text>
                  <Text mt={2}>{note.body.substring(0, 100)}...</Text>
                </Box>
              );
            })}
          </SimpleGrid>
        )}
        <Center mt={4}>
          <Link href="/notes/new">
            <Button colorScheme="teal">Tambah Catatan</Button>
          </Link>
        </Center>
      </Box>
    </Center>
  );
}
