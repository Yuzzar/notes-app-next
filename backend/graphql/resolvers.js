const { Note } = require('../models');

const resolvers = {
  Query: {
    notes: async () => {
      try {
        const notes = await Note.findAll();
        console.log('Fetched Notes:', notes);
        return notes.map(note => ({
          ...note.dataValues,
          createdAt: note.createdAt ? note.createdAt.toISOString() : null,
          updatedAt: note.updatedAt ? note.updatedAt.toISOString() : null, 
        }));
      } catch (error) {
        console.error('Error fetching notes:', error);
        throw new Error('Error fetching notes');
      }
    },
    note: async (parent, args) => {
      try {
        const note = await Note.findByPk(args.id);
        if (!note) {
          throw new Error('Note not found');
        }
        console.log('Fetched Note:', note);
        note.createdAt = note.createdAt ? note.createdAt.toISOString() : null;
        note.updatedAt = note.updatedAt ? note.updatedAt.toISOString() : null;
        return note;
      } catch (error) {
        console.error('Error fetching note:', error);
        throw new Error('Error fetching note');
      }
    },
  },
  Mutation: {
    addNote: async (parent, args) => {
      try {
        const newNote = await Note.create({
          title: args.title,
          body: args.body,
          createdAt: new Date(),
          updatedAt: new Date(),
        });
        console.log('Created Note:', newNote);
        newNote.createdAt = newNote.createdAt ? newNote.createdAt.toISOString() : null;
        newNote.updatedAt = newNote.updatedAt ? newNote.updatedAt.toISOString() : null;
        return newNote;
      } catch (error) {
        console.error('Error adding note:', error);
        throw new Error('Error adding note');
      }
    },
    updateNote: async (parent, args) => {
      try {
        console.log('Updating Note:', args.id);
        await Note.update(
          { title: args.title, body: args.body, updatedAt: new Date() },
          { where: { id: args.id } }
        );
        const updatedNote = await Note.findByPk(args.id);
        if (updatedNote) {
          console.log('Updated Note:', updatedNote);
          updatedNote.createdAt = updatedNote.createdAt ? updatedNote.createdAt.toISOString() : null;
          updatedNote.updatedAt = updatedNote.updatedAt ? updatedNote.updatedAt.toISOString() : null;
        }
        return updatedNote;
      } catch (error) {
        console.error('Error updating note:', error);
        throw new Error('Error updating note');
      }
    },
    deleteNote: async (parent, args) => {
      try {
        console.log('Deleting Note:', args.id);
        const note = await Note.findByPk(args.id);
        if (note) {
          await Note.destroy({ where: { id: args.id } });
          console.log('Deleted Note:', note);
          return note;
        }
        return null;
      } catch (error) {
        console.error('Error deleting note:', error);
        throw new Error('Error deleting note');
      }
    },
  },
};

module.exports = resolvers;
