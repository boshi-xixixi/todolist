import { create } from 'zustand';
import { Note, NoteFilterType, NoteSortType } from '@/types/note';

/**
 * 记事本状态管理接口
 */
interface NoteState {
  /** 记事本列表 */
  notes: Note[];
  /** 当前筛选类型 */
  filterType: NoteFilterType;
  /** 当前排序类型 */
  sortType: NoteSortType;
  /** 搜索关键词 */
  searchKeyword: string;
  /** 选中的标签 */
  selectedTag: string | null;
  /** 是否正在加载 */
  isLoading: boolean;
}

/**
 * 记事本操作接口
 */
interface NoteActions {
  /** 添加记事本 */
  addNote: (note: Omit<Note, 'id' | 'createdAt' | 'updatedAt'>) => void;
  /** 更新记事本 */
  updateNote: (id: string, updates: Partial<Omit<Note, 'id' | 'createdAt'>>) => void;
  /** 删除记事本 */
  deleteNote: (id: string) => void;
  /** 切换置顶状态 */
  togglePin: (id: string) => void;
  /** 设置筛选类型 */
  setFilterType: (filterType: NoteFilterType) => void;
  /** 设置排序类型 */
  setSortType: (sortType: NoteSortType) => void;
  /** 设置搜索关键词 */
  setSearchKeyword: (keyword: string) => void;
  /** 设置选中的标签 */
  setSelectedTag: (tag: string | null) => void;
  /** 获取筛选后的记事本列表 */
  getFilteredNotes: () => Note[];
  /** 获取所有标签 */
  getAllTags: () => string[];
  /** 加载记事本数据 */
  loadNotes: () => void;
  /** 初始化测试数据 */
  initializeTestNotes: () => void;
}

type NoteStore = NoteState & NoteActions;

/**
 * 生成唯一ID
 */
const generateId = (): string => {
  return Date.now().toString(36) + Math.random().toString(36).substr(2);
};

/**
 * 记事本状态管理
 */
export const useNoteStore = create<NoteStore>((set, get) => ({
  // 初始状态
  notes: [],
  filterType: NoteFilterType.ALL,
  sortType: NoteSortType.UPDATED_DESC,
  searchKeyword: '',
  selectedTag: null,
  isLoading: false,

  // 操作方法
  addNote: (noteData) => {
    const now = new Date().toISOString();
    const newNote: Note = {
      ...noteData,
      id: generateId(),
      createdAt: now,
      updatedAt: now,
    };
    
    set((state) => ({
      notes: [newNote, ...state.notes]
    }));
    
    // 保存到本地存储
    const { notes } = get();
    localStorage.setItem('todolist_notes', JSON.stringify(notes));
  },

  updateNote: (id, updates) => {
    const now = new Date().toISOString();
    
    set((state) => ({
      notes: state.notes.map((note) =>
        note.id === id
          ? { ...note, ...updates, updatedAt: now }
          : note
      )
    }));
    
    // 保存到本地存储
    const { notes } = get();
    localStorage.setItem('todolist_notes', JSON.stringify(notes));
  },

  deleteNote: (id) => {
    set((state) => ({
      notes: state.notes.filter((note) => note.id !== id)
    }));
    
    // 保存到本地存储
    const { notes } = get();
    localStorage.setItem('todolist_notes', JSON.stringify(notes));
  },

  togglePin: (id) => {
    set((state) => ({
      notes: state.notes.map((note) =>
        note.id === id
          ? { ...note, isPinned: !note.isPinned, updatedAt: new Date().toISOString() }
          : note
      )
    }));
    
    // 保存到本地存储
    const { notes } = get();
    localStorage.setItem('todolist_notes', JSON.stringify(notes));
  },

  setFilterType: (filterType) => {
    set({ filterType });
  },

  setSortType: (sortType) => {
    set({ sortType });
  },

  setSearchKeyword: (searchKeyword) => {
    set({ searchKeyword });
  },

  setSelectedTag: (selectedTag) => {
    set({ selectedTag });
  },

  getFilteredNotes: () => {
    const { notes, filterType, sortType, searchKeyword, selectedTag } = get();
    
    let filteredNotes = [...notes];
    
    // 按筛选类型过滤
    switch (filterType) {
      case NoteFilterType.PINNED:
        filteredNotes = filteredNotes.filter(note => note.isPinned);
        break;
      case NoteFilterType.RECENT:
        const sevenDaysAgo = new Date();
        sevenDaysAgo.setDate(sevenDaysAgo.getDate() - 7);
        filteredNotes = filteredNotes.filter(note => 
          new Date(note.updatedAt) >= sevenDaysAgo
        );
        break;
      case NoteFilterType.BY_TAG:
        if (selectedTag) {
          filteredNotes = filteredNotes.filter(note => 
            note.tags.includes(selectedTag)
          );
        }
        break;
      default:
        // ALL - 不过滤
        break;
    }
    
    // 按搜索关键词过滤
    if (searchKeyword.trim()) {
      const keyword = searchKeyword.toLowerCase();
      filteredNotes = filteredNotes.filter(note =>
        note.title.toLowerCase().includes(keyword) ||
        note.content.toLowerCase().includes(keyword) ||
        note.tags.some(tag => tag.toLowerCase().includes(keyword))
      );
    }
    
    // 排序
    filteredNotes.sort((a, b) => {
      // 置顶的记事本始终在前面
      if (a.isPinned && !b.isPinned) return -1;
      if (!a.isPinned && b.isPinned) return 1;
      
      switch (sortType) {
        case NoteSortType.CREATED_ASC:
          return new Date(a.createdAt).getTime() - new Date(b.createdAt).getTime();
        case NoteSortType.CREATED_DESC:
          return new Date(b.createdAt).getTime() - new Date(a.createdAt).getTime();
        case NoteSortType.UPDATED_ASC:
          return new Date(a.updatedAt).getTime() - new Date(b.updatedAt).getTime();
        case NoteSortType.UPDATED_DESC:
          return new Date(b.updatedAt).getTime() - new Date(a.updatedAt).getTime();
        case NoteSortType.TITLE_ASC:
          return a.title.localeCompare(b.title);
        case NoteSortType.TITLE_DESC:
          return b.title.localeCompare(a.title);
        default:
          return 0;
      }
    });
    
    return filteredNotes;
  },

  getAllTags: () => {
    const { notes } = get();
    const allTags = notes.flatMap(note => note.tags);
    return [...new Set(allTags)].sort();
  },

  loadNotes: () => {
    try {
      const savedNotes = localStorage.getItem('todolist_notes');
      if (savedNotes) {
        const notes = JSON.parse(savedNotes);
        set({ notes });
      } else {
        // 如果没有保存的数据，初始化测试数据
        get().initializeTestNotes();
      }
    } catch (error) {
      console.error('加载记事本数据失败:', error);
      // 如果加载失败，初始化测试数据
      get().initializeTestNotes();
    }
  },

  initializeTestNotes: () => {
    const testNotes: Note[] = [
      {
        id: 'note-1',
        title: '工作计划',
        content: '本周需要完成的工作任务：\n1. 完成项目需求分析\n2. 编写技术文档\n3. 代码review\n4. 参加团队会议',
        createdAt: new Date(Date.now() - 2 * 24 * 60 * 60 * 1000).toISOString(),
        updatedAt: new Date(Date.now() - 1 * 60 * 60 * 1000).toISOString(),
        isPinned: true,
        tags: ['工作', '计划'],
        color: '#fef3c7'
      },
      {
        id: 'note-2',
        title: '学习笔记',
        content: 'React Hooks 学习要点：\n- useState: 管理组件状态\n- useEffect: 处理副作用\n- useContext: 共享状态\n- useMemo: 性能优化',
        createdAt: new Date(Date.now() - 3 * 24 * 60 * 60 * 1000).toISOString(),
        updatedAt: new Date(Date.now() - 2 * 60 * 60 * 1000).toISOString(),
        isPinned: false,
        tags: ['学习', 'React'],
        color: '#bbf7d0'
      },
      {
        id: 'note-3',
        title: '购物清单',
        content: '本周需要购买的物品：\n- 牛奶\n- 面包\n- 鸡蛋\n- 蔬菜\n- 水果',
        createdAt: new Date(Date.now() - 1 * 24 * 60 * 60 * 1000).toISOString(),
        updatedAt: new Date(Date.now() - 30 * 60 * 1000).toISOString(),
        isPinned: false,
        tags: ['生活', '购物'],
        color: '#bfdbfe'
      }
    ];
    
    set({ notes: testNotes });
    localStorage.setItem('todolist_notes', JSON.stringify(testNotes));
  }
}));