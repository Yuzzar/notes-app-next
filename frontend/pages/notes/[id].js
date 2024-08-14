  import { useRouter } from 'next/router';
  import { useState, useEffect, useRef } from 'react';
  import { Box, Heading, Text, Button, Flex, IconButton, AlertDialog, AlertDialogBody, AlertDialogFooter, AlertDialogHeader, AlertDialogContent, AlertDialogOverlay, useToast, Center } from '@chakra-ui/react';
  import { ArrowBackIcon } from '@chakra-ui/icons';
  import graphQLClient from '../../lib/graphql-client';
  import gql from 'graphql-tag';
  import Link from 'next/link';

  const GET_NOTE = gql`
    query Note($id: ID!) {
      note(id: $id) {
        id
        title
        createdAt
        body
      }
    }
  `;

  const DELETE_NOTE = gql`
    mutation DeleteNote($id: ID!) {
      deleteNote(id: $id) {
        id
      }
    }
  `;

  export default function NoteDetail() {
    const router = useRouter();
    const { id } = router.query;
    const [note, setNote] = useState(null);
    const [isOpen, setIsOpen] = useState(false);
    const cancelRef = useRef();
    const toast = useToast();

    useEffect(() => {
      if (id) {
        async function fetchNote() {
          try {
            const data = await graphQLClient.request(GET_NOTE, { id });
            setNote(data.note);
          } catch (error) {
            console.error('Error fetching note:', error);
          }
        }
    
        fetchNote();
      }
    }, [id]);

    const onDelete = async () => {
      try {
        await graphQLClient.request(DELETE_NOTE, { id });
        toast({
          title: "Catatan berhasil dihapus.",
          status: "success",
          duration: 3000,
          isClosable: true,
        });
        router.push('/');
      } catch (error) {
        console.error('Error deleting note:', error);
        toast({
          title: "Gagal menghapus catatan.",
          description: "Terjadi kesalahan saat menghapus catatan.",
          status: "error",
          duration: 3000,
          isClosable: true,
        });
      }
    };

    const openDeleteConfirmation = () => setIsOpen(true);
    const closeDeleteConfirmation = () => setIsOpen(false);

    if (!note) {
      return <p>Loading...</p>;
    }

    const formattedDate = note.createdAt ? new Date(parseInt(note.createdAt)).toLocaleString() : 'Invalid Date';

    return (
      <Box 
        position="relative" 
        minH="100vh" 
        p={5} 
        bg="gray.700"  
      >
        <IconButton
          icon={<ArrowBackIcon />}
          onClick={() => router.push('/')}
          aria-label="Kembali ke Beranda"
          variant="ghost"
          position="absolute"
          bg="blue.50"
          top="20px"
          left="20px"
          color="black"
        />
    
        <Center h="100%">
          <Box p={5} maxW="500px" width="100%" bg="white" borderRadius="md" boxShadow="md">
            <Heading textAlign="center" mb={4}>
              Detail Catatan
            </Heading>
            <Box p={5} bg="gray.100" borderRadius="md" boxShadow="md">
              <Heading mb={4} size="md" color="gray.800">{note.title}</Heading>
              <Text fontSize="sm" mb={4} color="gray.600">{formattedDate}</Text>
              <Text color="gray.800">{note.body}</Text>
            </Box>
            <Flex mt={4} justifyContent="center">
              <Button colorScheme="red" onClick={openDeleteConfirmation} mr={2}>
                Hapus Catatan
              </Button>
              <Link href={`/notes/edit/${note.id}`} passHref>
                <Button colorScheme="teal" as="a" mr={2}>
                  Edit Catatan
                </Button>
              </Link>
            </Flex>
          </Box>
        </Center>
    
        <AlertDialog
          isOpen={isOpen}
          leastDestructiveRef={cancelRef}
          onClose={closeDeleteConfirmation}
        >
          <AlertDialogOverlay>
            <AlertDialogContent>
              <AlertDialogHeader fontSize="lg" fontWeight="bold">
                Hapus Catatan
              </AlertDialogHeader>
    
              <AlertDialogBody>
                Apakah Anda yakin ingin menghapus catatan ini? Tindakan ini tidak dapat dibatalkan.
              </AlertDialogBody>
    
              <AlertDialogFooter>
                <Button ref={cancelRef} onClick={closeDeleteConfirmation}>
                  Batal
                </Button>
                <Button colorScheme="red" onClick={onDelete} ml={3}>
                  Hapus
                </Button>
              </AlertDialogFooter>
            </AlertDialogContent>
          </AlertDialogOverlay>
        </AlertDialog>
      </Box>
    );
  }    